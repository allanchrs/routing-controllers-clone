import { HttpMethodEnum } from "../../enums"

type DefineOutput = (target: any, propertyKey: string, descriptor: PropertyDescriptor) => any

export type RouteDecoratorInput = {
  path?: string;
  status?: number;
}

type Input = {
  method: HttpMethodEnum,
  path?: string,
  status?: number,
  interceptor?: (input: Partial<Input>) => (target: any, propertyKey: string, descriptor: PropertyDescriptor) => void
}

const registerRoute = ({ method, path, status, target, descriptor }: Input & { target: any, descriptor: PropertyDescriptor }) => {
  if (!target.routes) {
    target.routes = [];
  }
  target.routes.push({
    method,
    status,
    path,
    handler: descriptor.value
  });

  return descriptor;
}

export const baseHttpDecorator = (input: Input): DefineOutput => {
  return (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
    if (input.interceptor) {
      input.interceptor(input)(target, propertyKey, descriptor);
    };

    const { method, status, path } = input;
    return registerRoute({ target, descriptor, method, status, path })
  }
}