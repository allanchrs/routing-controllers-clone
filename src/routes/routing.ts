import { IncomingMessage, ServerResponse } from "http";
import { Server } from "socket.io";
import { Router } from "./router";
import { NotFoundException } from "@exceptions/not-fount.exception";
import { BadRequestException } from "@exceptions/bad-request.exception";
import { HttpMethodEnum, HttpStatusCodeEnum } from "@common/enums";
import { bodyToJson } from "@common/utils";
import { MapRouter } from "@local-types/map-router.type";
import { logger } from "@utils/logger/logger";

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
    if (!request) {
      throw new Error("Invalid Request");
    }

    if (!request.method) {
      throw new BadRequestException("Bad request: Missing method");
    }

    if (!request.url) {
      throw new BadRequestException("Bad request: Missing URL");
    }

    const allowed_methods = Object.entries(HttpMethodEnum).map(([key]) => key);

    if (!allowed_methods.includes(request.method)) {
      throw new BadRequestException(`Bad request: "${request.method}" is a invalid method http`);
    }
  }

  private async setJsonBody(request: IncomingMessage): Promise<void> {
    Object.assign(request, { body: await bodyToJson({ arg: request }) })
  }

  private async runMiddlewares(route: MapRouter, args: [IncomingMessage, ServerResponse]): Promise<void> {
    if (!route.middlewares) return;

    for await (const middleware of route.middlewares) {
      await middleware.handler.apply(middleware, [...args, this.io])
    }
  }

  private requestLogger(route: MapRouter): void {
    logger.info(`${new Date().toISOString()}: [${route.method}] /${this.getRouteUrl(route.prefix, route.path)}`)
  }

  /**
   * Handles incoming HTTP requests.
   * @param request The incoming request object.
   * @param response The server response object.
   */
  async handleRequest(request: IncomingMessage, response: ServerResponse): Promise<void> {

    try {
      this.validateRequest(request);
      this.setDefaultResponseHeaders(response);

      if ((request.method as string).toUpperCase() === HttpMethodEnum.OPTIONS) {
        return this.options(response);
      }

      const method = request.method as string;

      const route = this.getRoute(method, request.url);

      if (!route) {
        throw new NotFoundException(`Route [${method}]: ${request.url} not found.`);
      }

      this.requestLogger(route);
      await this.setJsonBody(request);
      await this.runMiddlewares(route, [request, response]);
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
