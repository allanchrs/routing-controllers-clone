import { IncomingMessage } from "http";

type Args = {
  arg?: IncomingMessage,
  prefix?: string,
  path?: string,
  param?: string
}

export const urlParamToString = async ({ arg: request, path, prefix, param }: Args): Promise<string | undefined> => {
  if (!request || !path) return;

  const url = prefix ? `${prefix}/${path}` : path;

  const index = url.split('/').findIndex(((key) => {
    return key.replace(':', '') === param
  }));

  return request.url?.split('/').filter((value) => value && value !== '')[index];
}