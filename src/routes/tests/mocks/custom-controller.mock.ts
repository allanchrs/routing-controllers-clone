import { Controller, Get, Post } from "@common/decorators";

@Controller('custom')
export class MockCustomController {
  @Get()
  getDefault() {
    return { success: true, path: '/' }
  }

  @Get({ path: 'param/:id' })
  getWithParam() {
    return { success: true, path: 'param/:id' }
  }

  @Post({ path: 'custom', status: 201 })
  getCustom() {
    return { success: true, path: 'custom' }
  }

  @Get({ path: 'throw' })
  getThrow() {
    throw new Error("Throw route");
  }
}