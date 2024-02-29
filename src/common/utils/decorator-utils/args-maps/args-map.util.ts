import { ParamDecoratorEnum } from "@common/enums";
import { IncomingMessage, ServerResponse } from "http";
import { Server } from "socket.io";

export const http_args_mapper_params = ([request, response, io]: [IncomingMessage, ServerResponse, Server | undefined]) => {
  return {
    [ParamDecoratorEnum.BODY]: request,
    [ParamDecoratorEnum.PARAM]: request,
    [ParamDecoratorEnum.QUERY]: request,
    [ParamDecoratorEnum.REQ]: request,
    [ParamDecoratorEnum.RES]: response,
    [ParamDecoratorEnum.SOCKET]: io
  }
}
