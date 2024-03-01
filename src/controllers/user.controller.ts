import { Body, Controller, Param, Post, Put } from "@common/decorators";

/**
 * Controller responsible for handling user-related requests.
 */
@Controller('users')
export class UserController {

  /**
   * Endpoint for creating a new user.
   * @param body The request body containing user data.
   * @returns The created user object.
   */
  @Post({ path: 'create', status: 201 })
  async create(
    @Body() body: any,
  ): Promise<any> {
    return { ...body };
  }

  /**
   * Endpoint for updating an existing user.
   * @param body The request body containing updated user data.
   * @param id The ID of the user to be updated.
   * @returns The updated user object.
   */
  @Put({ path: 'update/:id', status: 201 })
  async update(
    @Body() body: any,
    @Param('id') id: string
  ): Promise<any> {
    return { ...body, id };
  }
}
