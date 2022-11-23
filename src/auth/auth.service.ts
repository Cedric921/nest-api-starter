import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { iAuthDto } from './dto';
import * as argon from 'argon2';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable({})
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
    private config: ConfigService,
  ) {}
  async register(dto: iAuthDto) {
    try {
      // generate the hash
      const hash = await argon.hash(dto.password);
      // save the user into the db
      const user = await this.prisma.user.create({
        data: {
          email: dto.email,
          hash,
        },
      });

      return { access_token: this.generateToken(user.id, user.email) };
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code == 'P2002') {
          throw new ForbiddenException('Credentials already taken');
        }
      }
      throw error;
    }
  }

  async login(dto: iAuthDto) {
    // find user by email
    const user = await this.prisma.user.findFirst({
      where: {
        email: dto.email,
      },
    });

    // if user not exist throw error
    if (!user) throw new ForbiddenException('Creadential incorrect ');
    // compare password
    const passwordMatched = await argon.verify(user.hash, dto.password);

    // if password matched send back user
    if (!passwordMatched) throw new ForbiddenException(' Credentials error');

    return { access_token: this.generateToken(user.id, user.email) };
  }

  async generateToken(userId: number, email: string): Promise<string> {
    const secret = this.config.get('JWT_SECRET');
    const data = {
      sub: userId,
      email,
    };
    const token = await this.jwt.signAsync(data, {
      expiresIn: '30m',
      secret,
    });
    console.log(token);
    return token;
  }
}
