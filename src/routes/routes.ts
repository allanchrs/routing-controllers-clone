import { IncomingMessage, ServerResponse } from "http";
import { Server } from "socket.io";
import { ParamDecoratorEnum } from "@common/enums";

type RouteController = {
  method: 'POST',
  status?: number,
  path?: string,
  handler: Function
};

type Controller = {
  routes: RouteController[],
  prefix?: string
}
export class Routes {
  constructor(private readonly config?: { controllers: (new () => any)[] }) { }
  public io?: Server

  setSocketInstance(io: Server) {
    this.io = io;
  }

  async options(response: ServerResponse) {
    response.writeHead(204)
    response.end()
  }

  private setDefaultResponseHeaders(response: ServerResponse) {
    response.setHeader('Access-Control-Allow-Origin', '*')
    response.setHeader('Content-type', 'application/json')
  }

  private getRouteUrl(prefix?: string, path?: string): string {
    if (prefix && path) {
      return `${prefix}/${path}`;
    }

    if (prefix && !path) {
      return prefix;
    }

    if (!prefix && path) {
      return path;
    }

    return ''
  }

  private routeNotFoundResponse(request: IncomingMessage, response: ServerResponse) {
    const url = request.url;
    response.writeHead(404)
    response.end(JSON.stringify({
      exception: 'NotFoundException',
      message: `Route with url [${request.method}] '${url}' not found`
    }));
  }

  private getControllerRoutes(Controller: new () => any): Controller {
    return Object.getOwnPropertyDescriptors(Controller).prototype.value as Controller;
  }

  private getMatchRoute(routes: RouteController[], request: IncomingMessage, prefix?: string,): RouteController | undefined {
    if (!routes) return;
    const request_method = request.method as string
    const request_url = request.url as string;
    return routes
      .filter(({ method }) => method.toLowerCase() === request_method.toLowerCase())
      .find((route) => {
        const maped_url = this.getRouteUrl(prefix, route.path).split('/');
        const format_request_url = request_url.trim().replace(/^\//, '');
        const maped_request_url = format_request_url.split('/');

        const fill_url = maped_url.map((url, index) => {
          if (url.includes(':')) return maped_request_url[index];

          return url
        }).join('/')

        return fill_url === format_request_url
      })
  }

  private throwResponse(response: ServerResponse, message: string) {
    response.writeHead(500)
    response.end(JSON.stringify({
      exception: 'InternalServerError',
      message
    }));
  }

  private async executeRouteController({
    Controller,
    request,
    response,
    route
  }: { Controller: new () => any; route: RouteController; request: IncomingMessage; response: ServerResponse }): Promise<void> {
    try {
      const controller = new Controller();
      const output = await route.handler.apply(controller, [
        {
          [ParamDecoratorEnum.BODY]: request,
          [ParamDecoratorEnum.REQ]: request,
          [ParamDecoratorEnum.RES]: response,
          [ParamDecoratorEnum.SOCKET]: this.io
        }
      ]);

      response.writeHead(route.status ?? 200)
      response.end(JSON.stringify(output))
    } catch (error: any) {
      this.throwResponse(response, error.message)
    }
  }

  async handler(request: IncomingMessage, response: ServerResponse) {
    this.setDefaultResponseHeaders(response)

    if (!request.method) return this.throwResponse(response, 'method not allowed')
    if (!request.url) return this.routeNotFoundResponse(request, response)
    if (!this.config) return this.routeNotFoundResponse(request, response)
    if (this.config.controllers.length === 0) return this.routeNotFoundResponse(request, response)

    if ((request.method as string).toLowerCase() === 'options') return this.options(response);

    for await (const Controller of this.config.controllers) {
      const { routes, prefix } = this.getControllerRoutes(Controller);

      const route = this.getMatchRoute(routes, request, prefix)

      if (route) {
        return this.executeRouteController({ Controller, route, request, response })
      }

      return this.routeNotFoundResponse(request, response)
    }
  }
}