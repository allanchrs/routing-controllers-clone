import { Controller, Get, Param, Post } from "@common/decorators";

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
  getCustom() {
    return { success: true, path: 'custom' }
  }

  @Get('throw')
  getThrow() {
    throw new Error("Throw route");
  }
}