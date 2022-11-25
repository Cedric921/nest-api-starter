import { BookmarkService } from './bookmark.service';
import { JwtGuard } from './../auth/guard/jwt.guard';
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { GetUser } from '../auth/decorator';
import { CreateBookmarkDTO, EditBookmarkDTO } from './dto';

@UseGuards(JwtGuard)
@Controller('bookmarks')
export class BookmarkController {
  constructor(private bookmarkService: BookmarkService) {}
  @Get()
  getBookmarks(@GetUser('id', ParseIntPipe) idUser: number) {
    return this.bookmarkService.getBookmarks(idUser);
  }

  @Get(':id')
  getOneBookmark(
    @GetUser('id') idUser: number,
    @Param('id', ParseIntPipe) idBook: number,
  ) {
    return this.bookmarkService.getOneBookmark(idUser, idBook);
  }

  @Post()
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  createBookmark(
    @GetUser('id') idUser: number,
    @Body() dto: CreateBookmarkDTO,
  ) {
    return this.bookmarkService.createBookmark(idUser, dto);
  }

  @Patch(':id')
  editBookmark(
    @GetUser('id', ParseIntPipe) idUser: number,
    @Param('id', ParseIntPipe) idBook: number,
    @Body() dto: EditBookmarkDTO,
  ) {
    return this.bookmarkService.editBookmark(idUser, idBook, dto);
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id')
  deleteBookmark(
    @GetUser('id', ParseIntPipe) idUser: number,
    @Param('id', ParseIntPipe) idBook: number,
  ) {
    return this.bookmarkService.deleteBookmark(idUser, idBook);
  }
}
