/**
 * Represents a BadRequestException.
 * This error is thrown when the request is malformed or invalid.
 */
export class BadRequestException extends Error {
  /**
   * The HTTP status code associated with this exception.
   */
  public status = 400;
}
