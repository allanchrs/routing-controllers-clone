/**
 * Represents a NotFoundException.
 * This error is thrown when a requested resource is not found.
 */
export class NotFoundException extends Error {
  /**
   * The HTTP status code associated with this exception.
   */
  public status = 404;
}
