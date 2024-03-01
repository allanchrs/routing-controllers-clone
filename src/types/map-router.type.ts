import { Controller } from "./controller.type";
import { RequestHandler } from "./request-handler.type";

export type MapRouter = { handler: RequestHandler; controller: Controller; status?: number }