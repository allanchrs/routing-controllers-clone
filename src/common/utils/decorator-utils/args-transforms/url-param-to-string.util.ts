import { IncomingMessage } from "http";

/**
 * Arguments for the urlParamToString function.
 */
type Args = {
  arg?: IncomingMessage,
  prefix?: string,
  path?: string,
  param?: string
}

/**
 * Converts a URL parameter to a string.
 * @param {Args} args - Arguments for the urlParamToString function.
 * @returns {Promise<string | undefined>} A promise that resolves to the string value of the URL parameter.
 */
export const urlParamToString = async ({ arg: request, path, prefix, param }: Args): Promise<string | undefined> => {
  if (!request || !path) return;

  const url = prefix ? `${prefix}/${path}` : path;
  const index = url.split('/').findIndex(((key) => {
    return key.replace(':', '') === param
  }));

  return request.url?.split('/').filter((value) => value && value !== '')[index];
}