import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { iAuthDto } from './dto';
import * as argon from 'argon2';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';

@Injectable({})
export class AuthService {
  constructor(private prisma: PrismaService) {}
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

      delete user.hash;

      //return saved user data
      return user;
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

    delete user.hash;

    return user;
  }
}
