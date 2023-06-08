const mapping: Record<string, string> = {
  academies: 'academy',
  'academy-users': 'academy_user',
  players: 'player',
  users: 'user',
};

export function convertRouteToEntityUtil(route: string) {
  return mapping[route] || route;
}
