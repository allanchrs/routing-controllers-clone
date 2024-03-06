import { applyTransformerParamInterceptor, getFunctionParameterIndices } from "@common/utils";
import { IRequest } from "@interfaces/request.interface";
import { RouteDecoratorOptions } from "@local-types/route-decorator-options.type";
import { ServerResponse } from "http";
import { Server } from "socket.io";

// Define the type for the arguments of the intercepted method
type Args = [IRequest, ServerResponse, Server | undefined];

/**
 * Interceptor function for modifying or validating inputs before executing a method.
 * @param input Configuration for the interceptor.
 * @returns A function that acts as the interceptor.
 */
export const routeParamsInterceptor = (input: RouteDecoratorOptions) => {

  return async (target: any, key: string, descriptor: PropertyDescriptor) => {
    const method = descriptor.value as Function;
    const middlewares = input.middlewares?.map((Middleware) => new Middleware()) ?? [];
    // Override the original method with the intercepted method
    descriptor.value = async (...args: Args) => {
      for await (const middleware of middlewares) {
        await middleware.handler.apply(middleware, args);
      }
      // Get the indices of the method parameters
      const indices = getFunctionParameterIndices(target, key);

      // Apply transformers to modify or validate the parameters
      const params = await applyTransformerParamInterceptor({ ...input, indices, target, args });

      // Call the original method with the modified parameters
      return method.apply(this, [...params]);
    };

    return descriptor;
  };
};
