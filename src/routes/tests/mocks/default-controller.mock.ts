import { Body, Controller, Get, Post } from "@common/decorators";

@Controller()
export class MockDefaultController {
  @Get()
  getDefault() {
    return { success: true, path: '/' }
  }

  @Post({ path: 'custom', status: 201 })
  postCustom(
    @Body() body: any
  ) {
    return { success: true, path: 'custom', ...body }
  }
}