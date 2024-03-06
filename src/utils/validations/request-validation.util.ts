import { HttpMethodEnum } from "@common/enums";
import { BadRequestException } from "@exceptions/bad-request.exception";
import { IncomingMessage } from "http";

export class RequestValidations {
  handle(request: IncomingMessage): void {
    if (!request) {
      throw new Error("Invalid Request");
    }

    if (!request.method) {
      throw new BadRequestException("Bad request: Missing method");
    }

    if (!request.url) {
      throw new BadRequestException("Bad request: Missing URL");
    }

    const allowed_methods = Object.entries(HttpMethodEnum).map(([key]) => key);

    if (!allowed_methods.includes(request.method)) {
      throw new BadRequestException(`Bad request: "${request.method}" is a invalid method http`);
    }
  }
}