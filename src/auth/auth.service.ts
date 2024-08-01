import { ForbiddenException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import * as bcrypt from 'bcrypt';
import { PrismaService } from 'src/prisma/prisma.service';
import {
  Credentials,
  Jwt,
  Msg,
  SignupData as SignUpData,
} from 'src/type/auth.type';

@Injectable()
export class AuthService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
  ) {}

  async signUp(postData: SignUpData): Promise<Msg> {
    console.log('signUp');
    console.log(postData);
    const hashedPassword = await bcrypt.hash(postData.password, 12);
    try {
      await this.prismaService.user.create({
        data: {
          name: postData.name ?? '',
          email: postData.email,
          hashedPassword: hashedPassword,
        },
      });
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ForbiddenException('This email is already taken.');
        }
      }
    }
    return { message: 'ok' };
  }

  async login(postData: Credentials) {
    console.log('login');
    console.log(postData);
    const user = await this.prismaService.user.findUnique({
      where: { email: postData.email },
    });

    if (!user) throw new ForbiddenException('Email or password incorrect');
    const isValid = await bcrypt.compare(
      postData.password,
      user.hashedPassword,
    );
    if (!isValid) throw new ForbiddenException('Email or password incorrect');
    return this.generateJwt(user.id, user.email);
  }

  async generateJwt(userId: number, email: string): Promise<Jwt> {
    const payload = {
      sub: userId,
      email,
    };
    const secret = this.configService.get('JWT_SECRET');
    const token = await this.jwtService.signAsync(payload, {
      expiresIn: '5m',
      secret: secret,
    });

    return { accessToken: token };
  }
}
