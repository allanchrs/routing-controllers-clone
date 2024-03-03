
import { RouteDecoratorOptions } from "@local-types/route-decorator-options.type";
import { HttpMethodEnum } from "../../enums";
import { routeParamsInterceptor } from "@common/interceptors";
import { IMiddleware } from "@interfaces/middleware.interface";

/**
 * Decorator function for defining DELETE routes in a controller.
 * @param path Optional path of route.
 * @param options Optional input for configuring the route.
 * @returns A decorator function.
 */
export const RouteMiddleware = (middlewares: IMiddleware[]) => {
  /**
   * Decorator function that configures the route as a DELETE endpoint.
   * @param target The target object (prototype) of the class.
   * @param propertyKey The name of the method.
   * @param descriptor The property descriptor for the decorated method.
   */
  return routeBaseDecorator({ ...options, path, method: HttpMethodEnum.DELETE, interceptor: routeParamsInterceptor });
};
