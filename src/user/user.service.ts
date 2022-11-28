import { PrismaService } from './../prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import { EditUserDto } from './dto/edit-user.dto';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}
  async edituser(id: number, dto: EditUserDto) {
    //find use
    const user = await this.prisma.user.update({
      where: {
        id,
      },
      data: {
        ...dto,
      },
    });

    delete user.hash;
    return user;
  }
}
