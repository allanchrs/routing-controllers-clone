import { HttpMethodEnum } from "../../enums";
import { interceptor } from "../../interceptors/request.interceptor";
import { RouteDecoratorInput, baseHttpDecorator } from "./base.decorator";

/**
 * Decorator function for defining POST routes in a controller.
 * @param input Optional input for configuring the route.
 * @returns A decorator function.
 */
export const Post = (input?: RouteDecoratorInput) => {
  /**
   * Decorator function that configures the route as a POST endpoint.
   * @param target The target object (prototype) of the class.
   * @param propertyKey The name of the method.
   * @param descriptor The property descriptor for the decorated method.
   */
  return baseHttpDecorator({ ...input, method: HttpMethodEnum.POST, interceptor });
};
