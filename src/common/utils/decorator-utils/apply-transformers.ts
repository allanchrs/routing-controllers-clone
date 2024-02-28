import { RouteDecoratorInput } from "@common/decorators";
import { transformers } from "./transformers";
import { IncomingMessage, ServerResponse } from "http";
import { Server } from "socket.io";
import { http_args_mapper_params } from "./args-maps/args-map.util";

type Args = [IncomingMessage, ServerResponse, Server]
type ApplyTransformersArgs = {
  args: Args, indices: any[], target: any
} & RouteDecoratorInput


export const applyTransformers = async ({ indices, target, args, path }: ApplyTransformersArgs): Promise<any[]> => {
  const output: any[] = [];
  const { prefix } = target;

  console.log({ args })
  await Promise.all(
    indices.map(async ({ index, key, param }) => {
      const param_mapper = http_args_mapper_params(args);
      const arg = param_mapper[key];
      const transform = transformers[key];
      const parsedParam = await transform({ arg, prefix, path, param });
      output[index] = parsedParam;
    })
  );

  return output;
}
