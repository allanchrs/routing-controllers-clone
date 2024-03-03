import { ParamDecoratorEnum } from "@common/enums";
import { IncomingMessage, ServerResponse } from "http";
import { Server } from "socket.io";
import { bodyToJson, urlParamToString } from "./args-transforms";
import { IRequest } from "@interfaces/request.interface";

/**
 * Object containing transformers for different parameter types.
 */
export const transformers = {
  [ParamDecoratorEnum.BODY]: (args: { arg?: IRequest }) => args.arg?.body,
  [ParamDecoratorEnum.PARAM]: urlParamToString,
  [ParamDecoratorEnum.REQ]: (args: { arg?: IRequest }) => args.arg,
  [ParamDecoratorEnum.RES]: (args?: { arg?: ServerResponse }) => args?.arg,
  [ParamDecoratorEnum.SOCKET]: (args?: { arg?: Server }) => args?.arg,
};