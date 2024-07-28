import { User } from '@prisma/client';
import { OptionalProps } from './type';

export type Msg = {
  message: string;
};

export type Jwt = {
  accessToken: string;
};

export type SignupData = {
  name?: string;
  email: string;
  password: string;
};

export type Credentials = {
  email: string;
  password: string;
};

export type JwtPayload = OptionalProps<User, 'hashedPassword'>;
