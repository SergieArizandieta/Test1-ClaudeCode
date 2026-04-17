import { useState, useEffect, useRef, useCallback } from 'react';
import type { Chore, TeamMember } from '../types';

type ChoreSyncResult = {
  chores: Chore[];
  members: TeamMember[];
  setChores: React.Dispatch<React.SetStateAction<Chore[]>>;
  setMembers: React.Dispatch<React.SetStateAction<TeamMember[]>>;
  connected: boolean;
};

export function useChoreSync(): ChoreSyncResult {
  const [chores, setChoresState] = useState<Chore[]>([]);
  const [members, setMembersState] = useState<TeamMember[]>([]);
  const [connected, setConnected] = useState(false);

  const wsRef = useRef<WebSocket | null>(null);
  // Version counters distinguish local mutations from remote updates
  const choreVersionRef = useRef(0);
  const choreSentRef = useRef(0);
  const memberVersionRef = useRef(0);
  const memberSentRef = useRef(0);

  useEffect(() => {
    let ws: WebSocket;
    let reconnectTimer: ReturnType<typeof setTimeout>;

    const connect = () => {
      const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
      ws = new WebSocket(`${protocol}//${window.location.host}/ws`);
      wsRef.current = ws;

      ws.onopen = () => setConnected(true);

      ws.onmessage = (event) => {
        const msg = JSON.parse(event.data as string);
        if (msg.type === 'INIT') {
          setChoresState(msg.chores);
          setMembersState(msg.members);
        } else if (msg.type === 'SET_CHORES') {
          setChoresState(msg.chores);
        } else if (msg.type === 'SET_MEMBERS') {
          setMembersState(msg.members);
        }
      };

      ws.onclose = () => {
        setConnected(false);
        reconnectTimer = setTimeout(connect, 2000);
      };
    };

    connect();

    return () => {
      clearTimeout(reconnectTimer);
      ws?.close();
    };
  }, []);

  // Send chore mutations to server; skips echo from remote updates
  useEffect(() => {
    if (choreVersionRef.current > choreSentRef.current) {
      choreSentRef.current = choreVersionRef.current;
      if (wsRef.current?.readyState === WebSocket.OPEN) {
        wsRef.current.send(JSON.stringify({ type: 'SET_CHORES', chores }));
      }
    }
  }, [chores]);

  // Send member mutations to server; skips echo from remote updates
  useEffect(() => {
    if (memberVersionRef.current > memberSentRef.current) {
      memberSentRef.current = memberVersionRef.current;
      if (wsRef.current?.readyState === WebSocket.OPEN) {
        wsRef.current.send(JSON.stringify({ type: 'SET_MEMBERS', members }));
      }
    }
  }, [members]);

  const setChores = useCallback((action: React.SetStateAction<Chore[]>) => {
    choreVersionRef.current++;
    setChoresState(action);
  }, []);

  const setMembers = useCallback((action: React.SetStateAction<TeamMember[]>) => {
    memberVersionRef.current++;
    setMembersState(action);
  }, []);

  return { chores, members, setChores, setMembers, connected };
}
