import { MapRouter } from "@local-types/map-router.type";
import { IncomingMessage, ServerResponse } from "http";
import { Server } from "socket.io";

export class MiddlewareConfig {
  async handle(route: MapRouter, args: [IncomingMessage, ServerResponse, Server | undefined]) {
    if (!route.middlewares) return;

    for await (const middleware of route.middlewares) {
      await middleware.handler.apply(middleware, [...args])
    }
  }
}