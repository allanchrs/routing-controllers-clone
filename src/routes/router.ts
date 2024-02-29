import { NotFoundException } from "@exceptions/not-fount.exception";
import { RoutesNotFoundException } from "@exceptions/routes-not-found.exception";
import { getPrototypeValue } from "@utils/get-prototype-value.util";
import { getRouteMatchKey } from "@utils/url-match.util";
import { ControllerRoutes, RequestHandler } from "src/types";

type Controller = new () => {};

type RegisterRoute = {
  status?: number;
  method: string;
  path?: string;
  prefix?: string;
  handler: RequestHandler;
  controller: Controller
}

type MapRouter = { handler: RequestHandler; controller: Controller; status?: number }

export class Router {
  private routes: Map<string, MapRouter>;

  constructor() {
    this.routes = new Map();
  }

  private getRouteUrl(prefix?: string, path?: string): string {
    if (prefix && path) {
      return `${prefix}/${path}`;
    } else if (prefix && !path) {
      return prefix;
    } else if (!prefix && path) {
      return path;
    } else {
      return '';
    }
  }

  private registerRouteHandler({ method, path, prefix, handler, status, controller }: RegisterRoute) {
    const route_url = this.getRouteUrl(prefix, path);
    // console.log(`${method}|${route_url}`, { controller: controller.name })
    const route_key = `${method}|${route_url}`;
    this.routes.set(route_key, { status, handler, controller });
  }

  protected registerControllerRoutes(controller: Controller) {
    const { routes, prefix } = getPrototypeValue<Controller, ControllerRoutes>(controller);

    if (!routes) return;

    for (const { method, path, handler, status } of routes) {
      this.registerRouteHandler({
        method,
        path,
        prefix,
        status,
        controller,
        handler: handler.bind(controller)
      });
    }
  }

  private getRouteKey(method: string, url?: string): string | undefined {
    const route_keys = Array.from(this.routes.keys());

    if (!route_keys.length) {
      throw new RoutesNotFoundException();
    }

    return route_keys.find((route_key) => {
      const [route_method, route_url] = route_key.split('|');
      const match_route_key = getRouteMatchKey({ method, url }, { method: route_method, url: route_url })
      return !!match_route_key
    })
  }

  protected getRoute(method?: string, url?: string,): MapRouter | undefined {
    if (!method) throw new Error("Method not allowed.");

    const route_key = this.getRouteKey(method, url);

    return this.routes.get(route_key ?? '');
  }
}