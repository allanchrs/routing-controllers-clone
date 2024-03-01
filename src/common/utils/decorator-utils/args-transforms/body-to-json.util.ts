import { IncomingMessage } from "http";

/**
 * Arguments for the bodyToJson function.
 */
type Args = {
  arg?: IncomingMessage,
  prefix?: string,
  path?: string,
  param?: string
}

/**
 * Converts the body of an incoming message to JSON.
 * @param {Args} args - Arguments for the bodyToJson function.
 * @returns {Promise<any>} A promise that resolves to the parsed JSON body.
 */
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
