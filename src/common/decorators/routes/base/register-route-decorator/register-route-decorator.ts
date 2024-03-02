import { Input } from "./input";

export const registerRoute = ({ method, path, status, target, descriptor }: Input) => {
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