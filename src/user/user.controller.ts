import { EditUserDto } from './dto/edit-user.dto';
import { UserService } from './user.service';
import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  UseGuards,
} from '@nestjs/common';
import { User } from '@prisma/client';
import { GetUser } from '../auth/decorator';
import { JwtGuard } from '../auth/guard';

@Controller('users')
export class UserController {
  constructor(private userService: UserService) {}
  @UseGuards(JwtGuard)
  @Get('me')
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  getMe(@GetUser() user: User, @GetUser('email') email: string) {
    return user;
  }

  @UseGuards(JwtGuard)
  @Patch(':id')
  editUser(@Param('id', ParseIntPipe) id: number, @Body() dto: EditUserDto) {
    return this.userService.edituser(id, dto);
  }
}
