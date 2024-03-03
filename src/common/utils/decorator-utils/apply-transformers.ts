import { transformers } from "./transformers";
import { IncomingMessage, ServerResponse } from "http";
import { Server } from "socket.io";
import { http_args_mapper_params } from "./args-maps/args-map.util";
import { RouteDecoratorOptions } from "@local-types/route-decorator-options.type";
import { IRequest } from "@interfaces/request.interface";

type Args = [IRequest, ServerResponse, Server | undefined]

type ApplyTransformersArgs = {
  args: Args, indices: any[], target: any, path?: string
} & RouteDecoratorOptions

/**
 * Applies transformers to modify or validate method parameters based on the provided configuration.
 * @param args Arguments passed to the method.
 * @param indices Indices of the method parameters.
 * @param target The object instance containing the method.
 * @param path The path associated with the method.
 * @returns An array of modified or validated method parameters.
 */
export const applyTransformers = async ({ indices, target, args, path }: ApplyTransformersArgs): Promise<any[]> => {
  const output: any[] = [];
  const { prefix } = target;

  // Apply transformers to each method parameter asynchronously
  await Promise.all(
    indices.map(async ({ index, key, param }) => {
      // Get the parameter mapper for the HTTP arguments
      const param_mapper = http_args_mapper_params(args);
      // Get the argument value based on the parameter key
      const arg = param_mapper[key];
      // Get the transformer function for the parameter
      const transform = transformers[key];
      // Apply the transformer to the argument value
      const parsed_param = await transform({ arg, prefix, path, param });
      // Store the transformed parameter in the output array
      output[index] = parsed_param;
    })
  );

  // Return the array of modified or validated parameters
  return output;
}
