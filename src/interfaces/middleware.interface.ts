import { ServerResponse } from "http";
import { Server } from "socket.io";
import { IRequest } from "./request.interface";

export abstract class IMiddleware {
  abstract handler: (request: IRequest, response: ServerResponse, socket?: Server) => Promise<void>
}