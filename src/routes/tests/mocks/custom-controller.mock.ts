import { Controller, Get, Param, Post, Req } from "@common/decorators";
import { IRequest } from "@interfaces/request.interface";

@Controller('custom')
export class MockCustomController {
  @Get()
  getDefault() {
    return { success: true, path: '/' }
  }

  @Get('param/:id')
  getWithParam(
    @Param('id') id: string
  ) {
    return { success: true, path: `param/${id}` }
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