import { RouteDecoratorOptions } from "@local-types/route-decorator-options.type";
import { HttpMethodEnum } from "../../enums";
import { routeBaseDecorator } from "./base";
import { routeParamsInterceptor } from "@common/interceptors";

/**
 * Decorator function for defining PATCH routes in a controller.
 * @param path Optional path of route.
 * @param options Optional input for configuring the route.
 * @returns A decorator function.
 */
export const Patch = (path?: string, options?: RouteDecoratorOptions) => {
  /**
   * Decorator function that configures the route as a PUT endpoint.
   * @param target The target object (prototype) of the class.
   * @param propertyKey The name of the method.
   * @param descriptor The property descriptor for the decorated method.
   */
  return routeBaseDecorator({ ...options, path, method: HttpMethodEnum.PATCH, interceptor: routeParamsInterceptor });
};
