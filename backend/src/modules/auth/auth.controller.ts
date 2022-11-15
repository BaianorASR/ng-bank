import { LocalAuthGuard } from '@guards/local-auth.guard';
import { UserCreateDto } from '@modules/users/dtos';
import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async registerNewUser(@Body() userCreateDto: UserCreateDto) {
    return this.authService.registerNewUser(userCreateDto);
  }

  @UseGuards(AuthGuard('local'))
  @Post('login')
  async login() {
    return 'login';
  }
}
