import { IncomingMessage } from "http";
type Args = {
  arg?: IncomingMessage,
  prefix?: string,
  path?: string,
  param?: string
}

export const bodyToJson = ({ arg: request }: Args): Promise<any> => {
  return new Promise((resolve, reject) => {
    if (!request) return;
    let body = '';
    request.on('data', chunk => {
      body += chunk;
    });
    request.on('end', () => {
      try {
        const json = JSON.parse(body);
        resolve(json);
      } catch (error) {
        reject(error);
      }
    });
    request.on('error', reject);
  });
}