import { ServerResponse } from "http";
import { HttpStatusCodeEnum } from "@common/enums";

export class ErrorHandler {
  handle(error: any, response: ServerResponse): void {
    const status_code = error.status ?? HttpStatusCodeEnum.INTERNAL_SERVER_ERROR;
    response.writeHead(status_code);
    response.end(JSON.stringify({
      exception: error.constructor.name,
      message: error.message
    }));
  }
}