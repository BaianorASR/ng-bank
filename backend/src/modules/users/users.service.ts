import { Repository } from 'typeorm';

import { User } from '@database/entities';
import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';

import { UserCreateDto } from './dtos';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  async createNewUser(userCreateDto: UserCreateDto): Promise<User> {
    try {
      const userAlreadyExists = await this.findUserByUsername(
        userCreateDto.username,
      );

      if (userAlreadyExists) throw new ConflictException('User already exists');

      const newUser = this.usersRepository.create(userCreateDto);
      const createdUser = this.usersRepository.save(newUser);
      return createdUser;
    } catch (error) {
      if (error instanceof ConflictException) throw error;
      throw new InternalServerErrorException(error.message);
    }
  }

  async findUserByUsername(
    username: string,
    withPassword = false,
  ): Promise<User> {
    try {
      const user = await this.usersRepository.findOne({
        where: { username },
        select: {
          id: true,
          username: true,
          password: withPassword,
        },
      });

      return user;
    } catch (error) {
      throw new NotFoundException(`User with username ${username} not found`);
    }
  }

  async findOne(id: number): Promise<User> {
    try {
      const user = await this.usersRepository.findOneByOrFail({ id });
      return user;
    } catch (error) {
      throw new NotFoundException(`User with id ${id} not found`);
    }
  }
}
