export const MEMBER_COLORS = [
  '#e57373', // red
  '#64b5f6', // blue
  '#81c784', // green
  '#ffb74d', // orange
  '#ba68c8', // purple
  '#4dd0e1', // cyan
  '#f06292', // pink
  '#aed581', // light green
  '#ff8a65', // deep orange
  '#90a4ae', // blue grey
];

export function getNextColor(usedColors: string[]): string {
  const unused = MEMBER_COLORS.find((c) => !usedColors.includes(c));
  return unused ?? MEMBER_COLORS[usedColors.length % MEMBER_COLORS.length];
}
