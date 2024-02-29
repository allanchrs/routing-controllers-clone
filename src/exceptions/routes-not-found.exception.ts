export class RoutesNotFoundException extends Error {
  public status = 404;
  constructor() {
    super('No routes registered.')
  }
}