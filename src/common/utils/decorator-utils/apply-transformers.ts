import { RouteDecoratorInput } from "@common/decorators";
import { transformers } from "./transformers";

type ApplyTransformersArgs = {
  args: any[], indices: any[], target: any
} & RouteDecoratorInput

export const applyTransformers = async ({ indices, target, args: [args], path }: ApplyTransformersArgs): Promise<any[]> => {
  const output: any[] = [];
  const { prefix } = target;
  await Promise.all(
    indices.map(async ({ index, key, param }) => {
      const transform = transformers[key];
      const arg = args[key];
      const parsedParam = await transform({ arg, prefix, path, param });
      output[index] = parsedParam;
    })
  );

  return output;
}
