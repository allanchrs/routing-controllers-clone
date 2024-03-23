import { Controller, Get, Middlewares, Param, Post, Req } from "@common/decorators";
import { IRequest } from "@interfaces/request.interface";
import { Middleware } from "./middleware.mock";

@Controller('custom')
@Middlewares([Middleware])
export class MockCustomController {
  @Get()
  getDefault() {
    return { success: true, path: '/' }
  }

  @Get('param/:id', { middlewares: [] })
  getWithParam(
    @Param('id') id: string,
    @Req() req: IRequest,
  ) {
    return { success: true, path: `param/${id}`, authorization: req.headers.authorization }
  }

  @Post('custom', { status: 201 })
  getCustom(
    @Req() req: IRequest
  ) {
    return { success: true, path: 'custom', body: req.body }
  }

  @Get('throw')
  getThrow() {
    throw new Error("Throw route");
  }
}