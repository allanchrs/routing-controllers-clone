import { IMiddleware } from "@interfaces/middleware.interface";

export const Middlewares = <T extends IMiddleware = IMiddleware>(middlewares: (new () => T)[]) => {
  return (constructor: Function) => {
    constructor.prototype.middlewares = middlewares;
  }
}
