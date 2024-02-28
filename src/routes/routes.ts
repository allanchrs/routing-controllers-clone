import { IncomingMessage, ServerResponse } from "http";
import { Server } from "socket.io";
import { Router } from "./router";
import { NotFoundException } from "@exceptions/not-fount.exception";

export class Routes extends Router {
  constructor(private readonly config?: { controllers: (new () => any)[] }) {
    super()
    this.config?.controllers.forEach(controller => this.registerControllerRoutes(controller));
  }

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

  private routeNotFoundResponse(request: IncomingMessage, response: ServerResponse) {
    const url = request.url;
    response.writeHead(404)
    response.end(JSON.stringify({
      exception: 'NotFoundException',
      message: `Route with url [${request.method}] '${url}' not found`
    }));
  }

  private throwResponse(response: ServerResponse, message: string) {
    response.writeHead(500)
    response.end(JSON.stringify({
      exception: 'InternalServerError',
      message
    }));
  }

  async handler(request: IncomingMessage, response: ServerResponse) {
    this.setDefaultResponseHeaders(response)

    if (request.method?.toLowerCase() === 'options') return this.options(response);

    const route = this.getRoute(request.method, request.url);

    if (!route) {
      throw new NotFoundException(`Route [${request.method}]:${request.url} not found.`);
    }

    const output = await route.handler(request, response, this.io);

    response.writeHead(route.status ?? 200);
    response.end(output);

  }
}