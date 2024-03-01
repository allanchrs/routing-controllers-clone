import { HttpMethodEnum } from "../../enums";
import { RouteDecoratorInput, baseHttpDecorator } from "./base.decorator";
import { interceptor } from "../../interceptors/request.interceptor";

/**
 * Decorator function for defining GET routes in a controller.
 * @param input Optional input for configuring the route.
 * @returns A decorator function.
 */
export const Get = (input?: RouteDecoratorInput) => {
  /**
   * Decorator function that configures the route as a GET endpoint.
   * @param target The target object (prototype) of the class.
   * @param propertyKey The name of the method.
   * @param descriptor The property descriptor for the decorated method.
   */
  return baseHttpDecorator({ ...input, method: HttpMethodEnum.GET, interceptor });
};
