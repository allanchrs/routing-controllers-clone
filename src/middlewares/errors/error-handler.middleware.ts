import { ServerResponse } from "http";
import { HttpStatusCodeEnum } from "@common/enums";

export class ErrorHandler {
  async handle(error: any, response: ServerResponse): Promise<void> {
    const status_code = error.status ?? HttpStatusCodeEnum.INTERNAL_SERVER_ERROR;
    response.writeHead(status_code);
    response.end(JSON.stringify({
      exception: error.constructor.name,
      message: error.message
    }));
  }
}