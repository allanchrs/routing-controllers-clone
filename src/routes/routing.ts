import { IncomingMessage, ServerResponse } from "http";
import { Server } from "socket.io";
import { Router } from "./router";
import { NotFoundException } from "@exceptions/not-fount.exception";

export class Routing extends Router {
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

  async handler(request: IncomingMessage, response: ServerResponse) {
    this.setDefaultResponseHeaders(response)

    if (request.method?.toLowerCase() === 'options') return this.options(response);

    try {
      const route = this.getRoute(request.method, request.url);

      if (!route) {
        throw new NotFoundException(`Route [${request.method}]: ${request.url} not found.`);
      }
      const output = await route.handler(request, response, this.io);
      response.writeHead(route.status ?? 200);
      response.end(JSON.stringify(output));
    } catch (error: any) {
      response.writeHead(error.status ?? 500);
      response.end(JSON.stringify({
        exception: error.constructor.name,
        message: error.message
      }));
    }
  }
}