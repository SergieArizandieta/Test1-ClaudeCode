import { WebSocketServer } from 'ws';

const PORT = 4001;
const state = { chores: [], members: [] };
const wss = new WebSocketServer({ port: PORT });

wss.on('connection', (ws) => {
  ws.send(JSON.stringify({ type: 'INIT', chores: state.chores, members: state.members }));

  ws.on('message', (raw) => {
    const msg = JSON.parse(raw);
    if (msg.type === 'SET_CHORES') state.chores = msg.chores;
    if (msg.type === 'SET_MEMBERS') state.members = msg.members;
    for (const client of wss.clients) {
      if (client !== ws && client.readyState === 1) {
        client.send(JSON.stringify(msg));
      }
    }
  });
});

console.log(`WS server running on ws://localhost:${PORT}`);
