/**
 * Enum representing HTTP status codes.
 */
export enum HttpStatusCodeEnum {
  OK = 200,                         // Successful response
  CREATED = 201,                    // Resource created successfully
  ACCEPTED = 202,                   // Request accepted for processing
  NO_CONTENT = 204,                 // No content to send for this request
  BAD_REQUEST = 400,                // The server could not understand the request
  UNAUTHORIZED = 401,               // Unauthorized access to the resource
  FORBIDDEN = 403,                  // Access to the resource is forbidden
  NOT_FOUND = 404,                  // Resource not found
  METHOD_NOT_ALLOWED = 405,         // Method not allowed for the resource
  CONFLICT = 409,                   // Conflict in the current state of the resource
  INTERNAL_SERVER_ERROR = 500,      // Internal server error
  NOT_IMPLEMENTED = 501,            // The server does not support the functionality required
  BAD_GATEWAY = 502,                // Bad gateway
  SERVICE_UNAVAILABLE = 503         // Service unavailable
}
