import { IncomingMessage } from "http";

export const getBodyAsJson = (request?: IncomingMessage): Promise<any> => {
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