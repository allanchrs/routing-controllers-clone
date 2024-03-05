import { IMiddleware } from "@interfaces/middleware.interface";
import { Controller } from "./controller.type";
import { RequestHandler } from "./request-handler.type";

export type MapRouter = {
  handler: RequestHandler;
  controller: Controller;
  status?: number
  middlewares?: IMiddleware[];
  method: string,
  path?: string,
  prefix?: string,
}