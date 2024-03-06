import { NoRoutesRegisteredException } from "@exceptions/no-routes-registered.exception";
import { NotFoundException } from "@exceptions/not-fount.exception";
import { ControllerRoutes } from "@local-types/controller-routes.type";
import { Controller } from "@local-types/controller.type";
import { MapRouter } from "@local-types/map-router.type";
import { RegisterRoute } from "@local-types/register-route.type";
import { logger } from "@utils/logger/logger";
import { getPrototypeValue } from "@utils/objects";
import { getRouteMatchKey } from "@utils/requests";

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
  protected getRouteUrl(prefix?: string, path?: string): string {
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

  private loggerMapedRoute(method: string, url: string): void {
    logger.info(`Route: [${method}] /${url}`)
  }

  /**
   * Registers a route handler.
   * @param param0 The route registration details.
   */
  private registerRouteHandler({
    method,
    path,
    prefix,
    ...rest
  }: RegisterRoute) {
    const route_url = this.getRouteUrl(prefix, path);
    const route_key = `${method}${this.ROUTE_SEPARATOR}${route_url}`;
    this.loggerMapedRoute(method, route_url);
    this.routes.set(route_key, { prefix, path, method, ...rest });
  }

  /**
   * Registers routes defined in a controller.
   * @param controller The controller containing route definitions.
   */
  protected registerControllerRoutes(controller: Controller) {
    const { routes, prefix, middlewares } = getPrototypeValue<Controller, ControllerRoutes>(controller);

    if (!routes) return;

    for (const { method, path, handler, status } of routes) {
      this.registerRouteHandler({
        method,
        path,
        prefix,
        status,
        controller,
        handler: handler.bind(controller),
        middlewares: middlewares?.map((Middleware) => new Middleware())
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

  private requestLogger(route: MapRouter): void {
    logger.info(`[${route.method}] /${this.getRouteUrl(route.prefix, route.path)}`)
  }


  /**
   * Retrieves the route handler for the given method and URL.
   * @param method The HTTP method.
   * @param url The URL of the request.
   * @returns The route handler.
   */
  protected getRoute(method: string, url?: string): MapRouter {
    const route_key = this.getRouteKey(method, url);

    const route = this.routes.get(route_key ?? '');

    if (!route) {
      throw new NotFoundException(`Route [${method}]: ${url} not found.`);
    }

    this.requestLogger(route);

    return route;
  }
}
