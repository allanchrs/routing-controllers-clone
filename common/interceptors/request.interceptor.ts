import { mapParamDecorators } from "../utils/map-param-decorator.util";

export const interceptor = async (target: any, key: string, descriptor: PropertyDescriptor) => {
  const method = descriptor.value as Function;
  descriptor.value = async (...args: any[]) => {
    const params = await mapParamDecorators({
      args,
      target,
      property: key,
    })

    return method.apply(this, [...params])
  };

  return descriptor;
}