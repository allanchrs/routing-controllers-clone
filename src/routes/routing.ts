import { IncomingMessage, ServerResponse } from "http";
import { Server } from "socket.io";
import { Router } from "./router";
import { NotFoundException } from "@exceptions/not-fount.exception";
import { BadRequestException } from "@exceptions/bad-request.exception";
import { HttpMethodEnum, HttpStatusCodeEnum } from "@common/enums";

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
    response.writeHead(HttpStatusCodeEnum.NO_CONTENT)
    response.end()
  }

  private setDefaultResponseHeaders(response: ServerResponse) {
    response.setHeader('Access-Control-Allow-Origin', '*')
    response.setHeader('Content-type', 'application/json')
  }

  private validateRequest(request: IncomingMessage) {
    if (!request || !request.method || !request.url) {
      throw new BadRequestException("Bad request: Missing method or URL");
    }
  }

  async handleRequest(request: IncomingMessage, response: ServerResponse) {
    if (request.method?.toUpperCase() === HttpMethodEnum.OPTIONS) {
      return this.options(response)
    };

    try {
      this.validateRequest(request);
      this.setDefaultResponseHeaders(response)

      const method = request.method as string;

      const route = this.getRoute(method, request.url);

      if (!route) {
        throw new NotFoundException(`Route [${method}]: ${request.url} not found.`);
      }

      const output = await route.handler(request, response, this.io);

      const status_code = route.status ?? HttpStatusCodeEnum.OK;
      response.writeHead(status_code);
      response.end(JSON.stringify(output));
    } catch (error: any) {
      const status_code = error.status ?? HttpStatusCodeEnum.INTERNAL_SERVER_ERROR;
      response.writeHead(status_code);
      response.end(JSON.stringify({
        exception: error.constructor.name,
        message: error.message
      }));
    }
  }
}