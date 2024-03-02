import { registerRoute } from "../register-route-decorator";
import { Input } from "./input";
import { Output } from "./output";

export const routeBaseDecorator = (input: Input): Output => {
  return (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
    if (input.interceptor) {
      input.interceptor(input)(target, propertyKey, descriptor);
    };

    const { method, status, path } = input;
    return registerRoute({ target, descriptor, method, status, path })
  }
}