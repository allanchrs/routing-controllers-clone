import { IMiddleware } from "@interfaces/middleware.interface";
import { IRequest } from "@interfaces/request.interface";
import { ServerResponse, IncomingMessage } from "http";
import { Server } from "socket.io";
import { DefaultEventsMap } from "socket.io/dist/typed-events";

export class UserMiddleware implements IMiddleware {
  async handler(
    request: IRequest,
    response: ServerResponse<IncomingMessage>,
    socket?: Server<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any> | undefined
  ): Promise<void> {
    request.users = {
      ...request.users,
      user: {
        name: 'user'
      }
    }
  }
}