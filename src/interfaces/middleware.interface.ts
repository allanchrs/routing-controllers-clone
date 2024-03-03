import { IncomingMessage } from "http";

export abstract class IMiddleware {
  abstract handle: (request: IncomingMessage, response: IncomingMessage) => Promise<void>
}