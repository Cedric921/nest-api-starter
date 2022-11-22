import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class iAuthDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}
