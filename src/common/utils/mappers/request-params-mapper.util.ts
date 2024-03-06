import { ParamDecoratorEnum } from "@common/enums";
import { IRequest } from "@interfaces/request.interface";
import { ServerResponse } from "http";
import { Server } from "socket.io";

/**
 * Maps HTTP request parameters to their corresponding decorators.
 * @param {Array<IRequest, ServerResponse, Server | undefined>} args - The array containing the request, response, and server instances.
 * @returns {Object} An object mapping decorator enums to their corresponding HTTP request parameters.
 */
export const requestParamsMapper = ([request, response, io]: [IRequest, ServerResponse, Server | undefined]): object => {
  return {
    [ParamDecoratorEnum.BODY]: request,
    [ParamDecoratorEnum.PARAM]: request,
    [ParamDecoratorEnum.QUERY]: request,
    [ParamDecoratorEnum.REQ]: request,
    [ParamDecoratorEnum.RES]: response,
    [ParamDecoratorEnum.SOCKET]: io
  }
}
