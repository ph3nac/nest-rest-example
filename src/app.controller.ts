import { Controller, Get, Param, Post, Body } from '@nestjs/common';

import { UserService } from './user.service';
import { AppService } from './app.service';
import { User as UserModel } from '@prisma/client';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly userService: UserService,
  ) {}

  @Get('hello')
  getHello(): string {
    return this.appService.getHello();
  }

  @Post('user')
  async signupUser(
    @Body() userData: { name?: string; email: string },
  ): Promise<UserModel> {
    return this.userService.createUser(userData);
  }

  @Get('user/:id')
  async getUser(@Param('id') id: string): Promise<UserModel> {
    return this.userService.user({ id: Number(id) });
  }

  @Post('login')
  async login(
    @Body() credentials: { email: string; password: string },
  ): Promise<UserModel> {
    return this.userService.login(credentials);
  }

  @Post('logout')
  async logout(@Body() token: string): Promise<void> {
    return null;
  }
}
