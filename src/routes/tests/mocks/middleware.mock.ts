import { IMiddleware } from "@interfaces/middleware.interface";
import { IRequest } from "@interfaces/request.interface";
import { ServerResponse } from "http";
import { Server } from "socket.io";

export class Middleware implements IMiddleware {
  async handler(request: IRequest, response: ServerResponse, socket?: Server): Promise<void> {
    request.headers.authorization = 'some-authorization'
  }
}