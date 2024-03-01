/**
 * Enum representing parameter decorator types.
 */
export enum ParamDecoratorEnum {
  QUERY = 'query:index',        // Query parameter
  PARAM = 'param:index',        // Route parameter
  BODY = 'body:index',          // Request body
  REQ = 'request:index',        // Request object
  RES = 'response:index',       // Response object
  SOCKET = 'socket:index'       // Socket object
}
