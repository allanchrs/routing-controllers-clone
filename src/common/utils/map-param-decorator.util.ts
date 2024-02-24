import { IncomingMessage, ServerResponse } from "http";
import { ParamDecoratorEnum } from "../enums/param-decorator.enum";
import { getBodyAsJson } from "./body-as-json.util";
import { Server } from "socket.io";
import { RouteDecoratorInput } from "@common/decorators";
import { getParamFromRequest } from "./param-as-string.util";

type MapParamDecorators = {
  target: any,
  property: string,
  args: any[]
} & RouteDecoratorInput

const tranformer = {
  [ParamDecoratorEnum.BODY]: getBodyAsJson,
  [ParamDecoratorEnum.REQ]: (request?: IncomingMessage) => request,
  [ParamDecoratorEnum.RES]: (response?: ServerResponse) => response,
  [ParamDecoratorEnum.SOCKET]: (socket?: Server) => socket,
  [ParamDecoratorEnum.PARAM]: getParamFromRequest
}

const getFunctionParameterIndices = (target: any, property: any) => {
  return Reflect.getMetadataKeys(target, property)
    .filter((indice) => {
      const metadata = Reflect.getMetadata(indice, target, property);
      const param = metadata.param;
      const enums = Object.values(ParamDecoratorEnum).map((value) => param ? `${value}:${param}` : value);
      return enums.includes(indice)
    })
    .map(key => Reflect.getMetadata(key, target, property))
}

export const mapParamDecorators = async ({
  target,
  property,
  args: [args],
  path
}: MapParamDecorators): Promise<any[]> => {
  if (!Reflect.getMetadataKeys) return []
  if (!Reflect.getMetadata) return []

  const indices = getFunctionParameterIndices(target, property);

  const output_params: any[] = [];

  await Promise.all(
    indices.map(async ({ index, key, param }) => {
      const fn_transform = tranformer[key];
      const original_param = args[key];
      const parse_param = await fn_transform(original_param, target.prefix, path, param);
      output_params[index] = parse_param;
    })
  )

  return output_params;
}