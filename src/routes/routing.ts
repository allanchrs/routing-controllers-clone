import { IncomingMessage, ServerResponse } from "http";
import { Server } from "socket.io";
import { Router } from "./router";
import { NotFoundException } from "@exceptions/not-fount.exception";
import { BadRequestException } from "@exceptions/bad-request.exception";
import { HttpMethodEnum, HttpStatusCodeEnum } from "@common/enums";
import { setJsonBody } from "@common/utils";
import { MapRouter } from "@local-types/map-router.type";
import { logger } from "@utils/logger/logger";
import { ErrorHandler } from "@middlewares/errors";
import { MiddlewareConfig } from "@middlewares/middleware.config";
import { RequestValidations } from "@utils/validations";
import { ResponseHeadersConfigurer } from "@utils/requests";

export class Routing extends Router {
  private readonly errorHanlder = new ErrorHandler();
  private readonly middlewareConfig = new MiddlewareConfig()
  private readonly requestValidations = new RequestValidations()
  private readonly responseHeadersConfigurer = new ResponseHeadersConfigurer()

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

  private async setJsonBody(request: IncomingMessage): Promise<void> {
    Object.assign(request, { body: await setJsonBody({ arg: request }) })
  }


  /**
   * Handles incoming HTTP requests.
   * @param request The incoming request object.
   * @param response The server response object.
   */
  async handleRequest(request: IncomingMessage, response: ServerResponse): Promise<void> {

    try {
      this.requestValidations.handle(request);

      this.responseHeadersConfigurer.configure(response);

      if ((request.method as string).toUpperCase() === HttpMethodEnum.OPTIONS) {
        return this.options(response);
      }

      const route = this.getRoute(request.method as string, request.url);

      await this.setJsonBody(request);

      await this.middlewareConfig.handle(route, [request, response, this.io]);

      const output = await route.handler(request, response, this.io);

      const status_code = route.status ?? HttpStatusCodeEnum.OK;
      response.writeHead(status_code);
      response.end(JSON.stringify(output));
    } catch (error: any) {
      await this.errorHanlder.handle(error, response)
    }
  }
}
