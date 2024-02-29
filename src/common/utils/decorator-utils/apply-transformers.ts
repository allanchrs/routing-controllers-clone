import { RouteDecoratorInput } from "@common/decorators";
import { transformers } from "./transformers";
import { IncomingMessage, ServerResponse } from "http";
import { Server } from "socket.io";
import { http_args_mapper_params } from "./args-maps/args-map.util";

type Args = [IncomingMessage, ServerResponse, Server | undefined]
type ApplyTransformersArgs = {
  args: Args, indices: any[], target: any
} & RouteDecoratorInput


export const applyTransformers = async ({ indices, target, args, path }: ApplyTransformersArgs): Promise<any[]> => {
  const output: any[] = [];
  const { prefix } = target;
  await Promise.all(
    indices.map(async ({ index, key, param }) => {
      const param_mapper = http_args_mapper_params(args);
      const arg = param_mapper[key];
      const transform = transformers[key];
      const parsed_param = await transform({ arg, prefix, path, param });
      output[index] = parsed_param;
    })
  );
  return output;
}
