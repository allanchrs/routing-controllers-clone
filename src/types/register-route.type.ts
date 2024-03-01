import { Controller } from "./controller.type";
import { RequestHandler } from "./request-handler.type";

export type RegisterRoute = {
  status?: number;
  method: string;
  path?: string;
  prefix?: string;
  handler: RequestHandler;
  controller: Controller
}