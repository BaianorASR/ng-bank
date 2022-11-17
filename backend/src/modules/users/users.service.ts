import { DataSource, Repository } from 'typeorm';

import { Account, User } from '@database/entities';
import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';

import { UserCreateDto } from './dtos';
import { InjectRepository, InjectDataSource } from '@nestjs/typeorm';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    @InjectRepository(Account)
    private readonly accountsRepository: Repository<Account>,
    @InjectDataSource()
    private readonly dataSource: DataSource,
  ) {}

  async createNewUser(userCreateDto: UserCreateDto): Promise<any> {
    try {
      const userAlreadyExists = await this.findUserByUsername(
        userCreateDto.username,
      );

      if (userAlreadyExists) throw new ConflictException('User already exists');

      const newUser = await this.dataSource.transaction(
        async (manager): Promise<User> => {
          const user = await manager.save(User, {
            username: userCreateDto.username,
            password: userCreateDto.password,
          });

          await manager.save(Account, {
            user: user,
            balance: '0',
          });
          return user;
        },
      );

      return newUser;
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

  async findUserById(id: number): Promise<User> {
    try {
      const user = await this.usersRepository.findOneByOrFail({ id });
      return user;
    } catch (error) {
      throw new NotFoundException(`User with id ${id} not found`);
    }
  }
}
