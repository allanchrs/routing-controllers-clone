import { IncomingMessage } from "http";

export const getParamFromRequest = async (
  request?: IncomingMessage,
  prefix?: string,
  path?: string,
  param?: string
): Promise<string | undefined> => {
  if (!request || !path) return;

  const url = prefix ? `${prefix}/${path}` : path;

  const index = url.split('/').findIndex(((key) => {
    return key.replace(':', '') === param
  }));

  return request.url?.split('/').filter((value) => value && value !== '')[index];
}