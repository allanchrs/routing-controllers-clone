import { ParamDecoratorEnum } from "@common/enums";
import { IncomingMessage, ServerResponse } from "http";
import { Server } from "socket.io";
import { bodyToJson, urlParamToString } from "./args-transforms";

/**
 * Object containing transformers for different parameter types.
 */
export const transformers = {
  [ParamDecoratorEnum.BODY]: bodyToJson,
  [ParamDecoratorEnum.PARAM]: urlParamToString,
  [ParamDecoratorEnum.REQ]: (request?: IncomingMessage) => request,
  [ParamDecoratorEnum.RES]: (response?: ServerResponse) => response,
  [ParamDecoratorEnum.SOCKET]: (socket?: Server) => socket,
};