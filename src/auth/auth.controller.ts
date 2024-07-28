import { Body, Controller, HttpStatus, Post, HttpCode } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Jwt, Msg } from 'src/type/auth.type';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  signUp(@Body() postData: { email: string; password: string }): Promise<Msg> {
    return this.authService.signUp(postData);
  }

  @HttpCode(HttpStatus.OK)
  @Post('login')
  async login(
    @Body() postData: { email: string; password: string },
  ): Promise<Jwt> {
    return await this.authService.login(postData);
  }
}
