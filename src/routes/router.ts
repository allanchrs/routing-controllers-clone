import { NoRoutesRegisteredException } from "@exceptions/no-routes-registered.exception";
import { ControllerRoutes } from "@local-types/controller-routes.type";
import { Controller } from "@local-types/controller.type";
import { MapRouter } from "@local-types/map-router.type";
import { RegisterRoute } from "@local-types/register-route.type";
import { getPrototypeValue } from "@utils/get-prototype-value.util";
import { getRouteMatchKey } from "@utils/url-match.util";
export class Router {
  private routes: Map<string, MapRouter>;
  private readonly ROUTE_SEPARATOR = '|';

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
    const route_key = `${method}${this.ROUTE_SEPARATOR}${route_url}`;
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
      throw new NoRoutesRegisteredException();
    }

    return route_keys.find((route_key) => {
      const [route_method, route_url] = route_key.split(this.ROUTE_SEPARATOR);
      const match_route_key = getRouteMatchKey({ method, url }, { method: route_method, url: route_url })
      return !!match_route_key
    })
  }

  protected getRoute(method: string, url?: string,): MapRouter | undefined {
    const route_key = this.getRouteKey(method, url);

    return this.routes.get(route_key ?? '');
  }
}