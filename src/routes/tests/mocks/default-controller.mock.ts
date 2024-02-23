import { Controller, Get, Post } from "@common/decorators";

@Controller()
export class MockDefaultController {
  @Get()
  getDefault() {
    return { success: true, path: '/' }
  }

  @Post({ path: 'custom', status: 201 })
  getCustom() {
    return { success: true, path: 'custom' }
  }
}