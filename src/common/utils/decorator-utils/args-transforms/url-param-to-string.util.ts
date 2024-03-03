import { TransformArgs } from "@local-types/transform-args-.type";

/**
 * Converts a URL parameter to a string.
 * @param {TransformArgs} args - Arguments for the urlParamToString function.
 * @returns {Promise<string | undefined>} A promise that resolves to the string value of the URL parameter.
 */
export const urlParamToString = async ({ arg: request, path, prefix, param }: TransformArgs): Promise<string | undefined> => {
  if (!request || !path) return;

  const url = prefix ? `${prefix}/${path}` : path;
  const index = url.split('/').findIndex(((key) => {
    return key.replace(':', '') === param
  }));

  return request.url?.split('/').filter((value) => value && value !== '')[index];
}