import { transformers } from "./transformers";

type ApplyTransformersArgs = {
  args: any[], indices: any[], target: any
}

export const applyTransformers = async ({ indices, target, args: [args] }: ApplyTransformersArgs): Promise<any[]> => {
  const output: any[] = [];
  const { prefix, path } = target;
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
