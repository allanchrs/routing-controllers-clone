import { Controller, Get, Param, Post } from "@common/decorators";

@Controller('custom')
export class MockCustomController {
  @Get()
  getDefault() {
    return { success: true, path: '/' }
  }

  @Get({ path: 'param/:id' })
  getWithParam(
    @Param('id') id: string
  ) {
    return { success: true, path: `param/${id}` }
  }

  @Post({ path: 'custom', status: 201 })
  getCustom() {
    return { success: true, path: 'custom' }
  }

  @Get({ path: 'throw' })
  getThrow() {
    throw new Error("Throw route");
  }

  @Get({ path: 'test' })
  getTest() {
    throw new Error("Test Throw route");
  }
}