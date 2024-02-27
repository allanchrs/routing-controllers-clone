import { Body, Controller, Param, Post, Put } from "@common/decorators";

@Controller('users')
export class UserController {
  @Post({ path: 'create', status: 201 })
  async create(
    @Body() body: any,
  ): Promise<any> {
    return { ...body };
  }

  @Put({ path: 'update/:id', status: 201 })
  async update(
    @Body() body: any,
    @Param('id') id: string
  ): Promise<any> {
    console.log({ test: global.test })
    return { ...body, id };
  }
}