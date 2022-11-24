import { EditUserDto } from './dto/edit-user.dto';
import { UserService } from './user.service';
import { Body, Controller, Get, Param, Patch, UseGuards } from '@nestjs/common';
import { User } from '@prisma/client';
import { GetUser } from '../auth/decorator';
import { JwtGuard } from '../auth/guard';

@Controller('users')
export class UserController {
  constructor(private userService: UserService) {}
  @UseGuards(JwtGuard)
  @Get('me')
  getMe(@GetUser() user: User, @GetUser('email') email: string) {
    console.log({ email });
    return user;
  }

  @UseGuards(JwtGuard)
  @Patch(':id')
  editUser(@Param('id') id: number, @Body() dto: EditUserDto) {
    return this.userService.edituser(id, dto);
  }
}
