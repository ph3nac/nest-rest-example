import { Controller, Get, Request, UseGuards } from '@nestjs/common';
import { User } from '@prisma/client';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';
import { PrismaService } from 'src/prisma/prisma.service';

@Controller('user')
export class UserController {
  constructor(private readonly prismaService: PrismaService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  getProfile(@Request() req: { user: User }) {
    return req.user;
  }

  @UseGuards(JwtAuthGuard)
  @Get('all')
  getUsers() {
    return this.prismaService.user.findMany({
      select: { id: true, email: true },
    });
  }
}
