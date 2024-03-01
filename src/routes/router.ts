import { NoRoutesRegisteredException } from "@exceptions/no-routes-registered.exception";
import { ControllerRoutes } from "@local-types/controller-routes.type";
import { Controller } from "@local-types/controller.type";
import { MapRouter } from "@local-types/map-router.type";
import { RegisterRoute } from "@local-types/register-route.type";
import { getPrototypeValue } from "@utils/get-prototype-value.util";
import { getRouteMatchKey } from "@utils/url-match.util";

/**
 * Router class responsible for managing routes.
 */
export class Router {
  private routes: Map<string, MapRouter>;
  private readonly ROUTE_SEPARATOR = '|';

  /**
   * Constructor to initialize the Router.
   */
  constructor() {
    this.routes = new Map();
  }

  /**
   * Constructs the full route URL from prefix and path.
   * @param prefix The route prefix.
   * @param path The route path.
   * @returns The constructed route URL.
   */
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

  /**
   * Registers a route handler.
   * @param param0 The route registration details.
   */
  private registerRouteHandler({ method, path, prefix, handler, status, controller }: RegisterRoute) {
    const route_url = this.getRouteUrl(prefix, path);
    const route_key = `${method}${this.ROUTE_SEPARATOR}${route_url}`;
    this.routes.set(route_key, { status, handler, controller });
  }

  /**
   * Registers routes defined in a controller.
   * @param controller The controller containing route definitions.
   */
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

  /**
   * Gets the key of the matching route for the given method and URL.
   * @param method The HTTP method.
   * @param url The URL of the request.
   * @returns The key of the matching route.
   * @throws {NoRoutesRegisteredException} If no routes are registered.
   */
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

  /**
   * Retrieves the route handler for the given method and URL.
   * @param method The HTTP method.
   * @param url The URL of the request.
   * @returns The route handler.
   */
  protected getRoute(method: string, url?: string): MapRouter | undefined {
    const route_key = this.getRouteKey(method, url);

    return this.routes.get(route_key ?? '');
  }
}
