import { Body, Controller, Middlewares, Param, Post, Put, Req } from "@common/decorators";
import { IRequest } from "@interfaces/request.interface";
import { AdminMiddleware } from "src/middlewares/admin.middleware";
import { AuthMiddleware } from "src/middlewares/auth.middleware";
import { UserMiddleware } from "src/middlewares/user.middleware";

/**
 * Controller responsible for handling user-related requests.
 */
@Controller('users')
@Middlewares([AuthMiddleware])
export class UserController {

  /**
   * Endpoint for creating a new user.
   * @param body The request body containing user data.
   * @returns The created user object.
   */
  @Post('create', { status: 201, middlewares: [UserMiddleware, AdminMiddleware] })
  async create(
    @Body() body: any,
    @Req() req: IRequest
  ): Promise<any> {
    return { ...body };
  }

  /**
   * Endpoint for updating an existing user.
   * @param body The request body containing updated user data.
   * @param id The ID of the user to be updated.
   * @returns The updated user object.
   */
  @Put('update/:id', { status: 201 })
  async update(
    @Body() body: any,
    @Param('id') id: string
  ): Promise<any> {
    return { ...body, id };
  }
}
