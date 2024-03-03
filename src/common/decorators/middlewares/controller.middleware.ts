import { IMiddleware } from "@interfaces/middleware.interface";

export const ControllerMiddleware = (middlewares: IMiddleware[]) => {
  return (constructor: Function) => {
    constructor.prototype.middlewares = middlewares;
  }
}
