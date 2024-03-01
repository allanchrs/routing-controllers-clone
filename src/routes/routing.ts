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

  /**
   * Socket.io server instance.
   */
  public io?: Server;

  /**
   * Sets the Socket.io server instance.
   * @param io The Socket.io server instance.
   */
  setSocketInstance(io: Server): void {
    this.io = io;
  }

  /**
   * Handles OPTIONS requests.
   * @param response The server response object.
   */
  async options(response: ServerResponse): Promise<void> {
    response.writeHead(HttpStatusCodeEnum.NO_CONTENT);
    response.end();
  }

  /**
   * Sets default response headers.
   * @param response The server response object.
   */
  private setDefaultResponseHeaders(response: ServerResponse): void {
    response.setHeader('Access-Control-Allow-Origin', '*');
    response.setHeader('Content-type', 'application/json');
  }

  /**
   * Validates the incoming request.
   * @param request The incoming request object.
   * @throws {BadRequestException} If the request is invalid.
   */
  private validateRequest(request: IncomingMessage): void {
    if (!request || !request.method || !request.url) {
      throw new BadRequestException("Bad request: Missing method or URL");
    }
  }

  /**
   * Handles incoming HTTP requests.
   * @param request The incoming request object.
   * @param response The server response object.
   */
  async handleRequest(request: IncomingMessage, response: ServerResponse): Promise<void> {
    if (request.method?.toUpperCase() === HttpMethodEnum.OPTIONS) {
      return this.options(response);
    }

    try {
      this.validateRequest(request);
      this.setDefaultResponseHeaders(response);

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
