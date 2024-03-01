/**
 * Represents a NoRoutesRegisteredException.
 * This error is thrown when there are no routes registered in the router.
 */
export class NoRoutesRegisteredException extends Error {
  /**
   * The HTTP status code associated with this exception.
   */
  public status = 404;

  /**
   * Creates an instance of NoRoutesRegisteredException.
   * @param message The error message.
   */
  constructor(message: string = 'No routes registered in the router.') {
    super(message);
  }
}
