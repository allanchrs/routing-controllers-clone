import { IMiddleware } from "@interfaces/middleware.interface"
import { RouteController } from "./route-controller.type"

export type ControllerRoutes<T extends IMiddleware = IMiddleware> = {
  routes: RouteController[],
  prefix?: string
  middlewares?: (new () => T)[]
}