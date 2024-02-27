import { RouteDecoratorInput } from "@common/decorators";
import { applyTransformers, getFunctionParameterIndices } from "@common/utils";

export const interceptor = (input: RouteDecoratorInput) => {
  return async (target: any, key: string, descriptor: PropertyDescriptor) => {
    const method = descriptor.value as Function;
    descriptor.value = async (...args: any[]) => {
      const indices = getFunctionParameterIndices(target, key);
      const params = await applyTransformers({ args, indices, target, ...input });
      return method.apply(this, [...params])
    };

    return descriptor;
  }
}