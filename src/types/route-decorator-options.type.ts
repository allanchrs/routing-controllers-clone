import { IMiddleware } from "@interfaces/middleware.interface";

export type RouteDecoratorOptions<T extends IMiddleware = IMiddleware> = {
  status?: number;
  middlewares?: (new () => T)[]
}
