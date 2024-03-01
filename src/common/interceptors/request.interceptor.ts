import { RouteDecoratorInput } from "@common/decorators";
import { applyTransformers, getFunctionParameterIndices } from "@common/utils";
import { IncomingMessage, ServerResponse } from "http";
import { Server } from "socket.io";

// Define the type for the arguments of the intercepted method
type Args = [IncomingMessage, ServerResponse, Server | undefined];

/**
 * Interceptor function for modifying or validating inputs before executing a method.
 * @param input Configuration for the interceptor.
 * @returns A function that acts as the interceptor.
 */
export const interceptor = (input: RouteDecoratorInput) => {
  return async (target: any, key: string, descriptor: PropertyDescriptor) => {
    const method = descriptor.value as Function;

    // Override the original method with the intercepted method
    descriptor.value = async (...args: Args) => {
      // Get the indices of the method parameters
      const indices = getFunctionParameterIndices(target, key);

      // Apply transformers to modify or validate the parameters
      const params = await applyTransformers({ ...input, indices, target, args });

      // Call the original method with the modified parameters
      return method.apply(this, [...params]);
    };

    return descriptor;
  };
};
