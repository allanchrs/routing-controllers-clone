import { IMiddleware } from "@interfaces/middleware.interface";
import { IRequest } from "@interfaces/request.interface";
import { randomUUID } from "crypto";
import { ServerResponse, IncomingMessage } from "http";
import { Server } from "socket.io";
import { DefaultEventsMap } from "socket.io/dist/typed-events";

export class AuthMiddleware implements IMiddleware {
  async handler(
    request: IRequest,
    response: ServerResponse<IncomingMessage>,
    socket?: Server<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any> | undefined
  ): Promise<void> {
    request.auth = {
      'x-auth': randomUUID()
    }
  }
}