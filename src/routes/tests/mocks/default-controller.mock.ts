import { Body, Controller, Get, Post, Req } from "@common/decorators";
import { Middleware } from "./middleware.mock";
import { IRequest } from "@interfaces/request.interface";

@Controller()
export class MockDefaultController {
  @Get()
  getDefault() {
    return { success: true, path: '/' }
  }

  @Post('custom', { status: 201, middlewares: [Middleware] })
  postCustom(
    @Body() body: any,
    @Req() req: IRequest
  ) {
    return { success: true, path: 'custom', ...body, authorization: req.headers.authorization }
  }
}