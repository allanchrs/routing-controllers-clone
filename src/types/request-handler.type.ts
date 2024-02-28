import { IncomingMessage, ServerResponse } from "http";
import { Server } from "socket.io";

export type RequestHandler = (request: IncomingMessage, response: ServerResponse, io?: Server) => Promise<any>