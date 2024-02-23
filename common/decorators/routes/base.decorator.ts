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
  interceptor?: (target: any, propertyKey: string, descriptor: PropertyDescriptor) => void
}

const registerRoute = ({ method, path, status, target, descriptor }: Input & { target: any, descriptor: PropertyDescriptor }) => {
  if (!target.routes) {
    target.routes = [];
  }
  const prefix = target.constructor.prototype.prefix;

  target.routes.push({
    method,
    status,
    prefix,
    path: path,
    handler: descriptor.value
  });

  return descriptor;
}

export const baseHttpDecorator = ({ method, path, status, interceptor }: Input): DefineOutput => {
  return (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
    if (interceptor) {
      interceptor(target, propertyKey, descriptor);
    };

    return registerRoute({ target, descriptor, method, status, path })
  }
}