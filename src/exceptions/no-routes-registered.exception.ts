export class NoRoutesRegisteredException extends Error {
  public status = 404;
  constructor() {
    super('No routes registered in the router.')
  }
}