import { PrismaService } from '../prisma/prisma.service';
import { CreateBookmarkDTO, EditBookmarkDTO } from './dto';
import { Injectable, ForbiddenException } from '@nestjs/common';

@Injectable()
export class BookmarkService {
  constructor(private prisma: PrismaService) {}
  async getBookmarks(idUser: number) {
    return await this.prisma.bookmark.findMany({
      where: {
        userId: idUser,
      },
    });
  }

  async getOneBookmark(idUser: number, idBook) {
    return await this.prisma.bookmark.findFirst({
      where: {
        userId: idUser,
        id: idBook,
      },
    });
  }

  async createBookmark(idUser: number, dto: CreateBookmarkDTO) {
    return await this.prisma.bookmark.create({
      data: {
        userId: idUser,
        ...dto,
      },
    });
  }

  async editBookmark(idUser: number, idBook: number, dto: EditBookmarkDTO) {
    const bookmark = await this.prisma.bookmark.findUnique({
      where: {
        id: idBook,
      },
    });

    if (!bookmark || bookmark.userId !== idUser) {
      throw new ForbiddenException('Access to resource denied');
    }

    return await this.prisma.bookmark.update({
      where: {
        id: idBook,
      },
      data: { ...dto },
    });
  }

  async deleteBookmark(idUser: number, idBook: number) {
    const bookmark = await this.prisma.bookmark.findUnique({
      where: {
        id: idBook,
      },
    });

    if (!bookmark || bookmark.userId !== idUser) {
      throw new ForbiddenException('Access to resource denied');
    }

    return await this.prisma.bookmark.delete({
      where: {
        id: idBook,
      },
    });
  }
}
