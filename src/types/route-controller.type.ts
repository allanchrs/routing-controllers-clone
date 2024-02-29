export type RouteController = {
  method: 'POST',
  status?: number,
  path?: string,
  handler: Function
};