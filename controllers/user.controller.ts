import { Body, Controller, Post, Req, Socket } from "@common/decorators";
import { IncomingMessage } from "http";
import { Server } from "socket.io";

@Controller('users')
export class UserController {
  // private readonly createUser = new CreateUser(new UserRepository())

  @Post({ path: ':id/test/:aa', status: 201 })
  async create(
    @Socket() io: Server,
    @Body() body: any,
    @Req() req: IncomingMessage,
  ): Promise<any> {
    return body;
  }
}