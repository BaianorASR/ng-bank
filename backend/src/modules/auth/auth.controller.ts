import { CurrentUser } from '@decorators/current-user.decorator';
import { Public } from '@decorators/public-auth.decorator';
import { LocalAuthGuard } from '@guards/local-auth.guard';
import { ICurrentUser } from '@interfaces/current-user.interface';
import { UserCreateDto } from '@modules/users/dtos';
import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('me')
  async me(@CurrentUser() currentUser: ICurrentUser) {
    return currentUser;
  }

  @Post('register')
  @Public()
  async registerNewUser(@Body() userCreateDto: UserCreateDto) {
    return this.authService.registerNewUser(userCreateDto);
  }

  @UseGuards(LocalAuthGuard)
  @Public()
  @Post('login')
  async login(@CurrentUser() currentUser: ICurrentUser) {
    return this.authService.login(currentUser);
  }
}
