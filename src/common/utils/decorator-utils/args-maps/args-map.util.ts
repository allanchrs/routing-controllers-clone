import { ParamDecoratorEnum } from "@common/enums";
import { IncomingMessage, ServerResponse } from "http";
import { Server } from "socket.io";

/**
 * Maps HTTP request parameters to their corresponding decorators.
 * @param {Array<IncomingMessage, ServerResponse, Server | undefined>} args - The array containing the request, response, and server instances.
 * @returns {Object} An object mapping decorator enums to their corresponding HTTP request parameters.
 */
export const http_args_mapper_params = ([request, response, io]: [IncomingMessage, ServerResponse, Server | undefined]): object => {
  return {
    [ParamDecoratorEnum.BODY]: request,
    [ParamDecoratorEnum.PARAM]: request,
    [ParamDecoratorEnum.QUERY]: request,
    [ParamDecoratorEnum.REQ]: request,
    [ParamDecoratorEnum.RES]: response,
    [ParamDecoratorEnum.SOCKET]: io
  }
}
