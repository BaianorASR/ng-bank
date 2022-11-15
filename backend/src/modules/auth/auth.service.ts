import * as bcrypt from 'bcrypt';

import { User } from '@database/entities';
import { IAccessToken, ICurrentUser, IJwtTokenPayload } from '@interfaces';
import { UserCreateDto } from '@modules/users/dtos';
import { UsersService } from '@modules/users/users.service';
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async registerNewUser(userCreateDto: UserCreateDto): Promise<any> {
    const user = await this.usersService.createNewUser(userCreateDto);
    return this.login({ userId: user.id, username: user.username });
  }

  async validateUser(username: string, password: string): Promise<User> {
    const user = await this.usersService.findUserByUsername(username, true);
    if (user && bcrypt.compareSync(password, user.password)) {
      delete user.password;
      return user;
    }

    return null;
  }

  async login(currentUser: ICurrentUser): Promise<IAccessToken> {
    const payload: Partial<IJwtTokenPayload> = {
      username: currentUser.username,
      sub: currentUser.userId,
    };

    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }
}
