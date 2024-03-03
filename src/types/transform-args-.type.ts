import { IRequest } from "@interfaces/request.interface"
import { IncomingMessage } from "http"

/**
* Arguments for the transformer functions.
*/
export type TransformArgs = {
  arg?: IRequest | IncomingMessage,
  prefix?: string,
  path?: string,
  param?: string
}
