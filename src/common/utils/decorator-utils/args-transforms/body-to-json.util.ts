import { TransformArgs } from "@local-types/transform-args-.type";
import { IncomingMessage } from "http";

/**
 * Converts the body of an incoming message to JSON.
 * @param {TransformArgs} args - Arguments for the bodyToJson function.
 * @returns {Promise<any>} A promise that resolves to the parsed JSON body.
 */
export const bodyToJson = ({ arg: request }: TransformArgs): Promise<any> => {

  return new Promise((resolve, reject) => {
    if (!request) return resolve(null);

    if (!request.on) return resolve(null);

    let body: any[] = [];

    request.on('data', chunk => {
      body.push(chunk);
    });
    request.on('end', () => {
      try {
        const json = body.length ? JSON.parse(body.join()) : null;
        resolve(json);
      } catch (error) {
        reject(error);
      }
    });
    request.on('error', reject);
  });
}
