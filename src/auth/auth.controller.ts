import { Body, Controller, Post, ValidationPipe } from '@nestjs/common';
import { AuthService } from './auth.service';
import { iAuthDto } from './dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  register(@Body(new ValidationPipe()) dto: iAuthDto) {
    return this.authService.register(dto);
  }

  @Post('login')
  login(@Body(new ValidationPipe()) dto: iAuthDto) {
    return this.authService.login(dto);
  }
}
