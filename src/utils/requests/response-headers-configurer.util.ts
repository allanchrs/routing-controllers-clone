import { ServerResponse } from "http";

export class ResponseHeadersConfigurer {
  configure(response: ServerResponse): void {
    response.setHeader('Access-Control-Allow-Origin', '*');
    response.setHeader('Content-type', 'application/json');
  }
}