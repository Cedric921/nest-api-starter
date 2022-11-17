import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { iAuthDto } from './dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  register(@Body() dto: iAuthDto) {
    console.log({ dto });
    return this.authService.register();
  }

  @Post('login')
  login() {
    return this.authService.login();
  }
}
