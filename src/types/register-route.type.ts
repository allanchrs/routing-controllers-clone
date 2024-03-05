import { IMiddleware } from "@interfaces/middleware.interface";
import { Controller } from "./controller.type";
import { RequestHandler } from "./request-handler.type";

export type RegisterRoute<T extends IMiddleware = IMiddleware> = {
  status?: number;
  method: string;
  path?: string;
  prefix?: string;
  middlewares?: IMiddleware[];
  handler: RequestHandler;
  controller: Controller
}