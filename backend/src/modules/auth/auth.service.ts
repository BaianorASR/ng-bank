import * as bcrypt from 'bcrypt';

import { UserCreateDto } from '@modules/users/dtos';
import { UsersService } from '@modules/users/users.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class AuthService {
  constructor(private readonly usersService: UsersService) {}

  async registerNewUser(userCreateDto: UserCreateDto): Promise<any> {
    return this.usersService.createNewUser(userCreateDto);
  }

  async validateUser(username: string, password: string): Promise<any> {
    const user = await this.usersService.findUserByUsername(username, true);
    if (user && bcrypt.compareSync(password, user.password)) {
      const { password, ...result } = user;
      return result;
    }

    return null;
  }
}
