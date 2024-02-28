import { RouteDecoratorInput } from "@common/decorators";
import { applyTransformers, getFunctionParameterIndices } from "@common/utils";
import { IncomingMessage, ServerResponse } from "http";
import { Server } from "socket.io";

type Args = [IncomingMessage, ServerResponse, Server]
export const interceptor = (input: RouteDecoratorInput) => {
  return async (target: any, key: string, descriptor: PropertyDescriptor) => {
    const method = descriptor.value as Function;
    descriptor.value = async (...args: Args) => {
      const indices = getFunctionParameterIndices(target, key);
      const params = await applyTransformers({ ...input, indices, target, args });
      return method.apply(this, [...params])
    };

    return descriptor;
  }
}