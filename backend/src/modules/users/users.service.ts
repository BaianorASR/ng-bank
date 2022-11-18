import { DataSource, Repository } from 'typeorm';

import { Account, User } from '@database/entities';
import {
  ConflictException,
  HttpException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';

import { UserCreateDto } from './dtos';
import { InjectRepository, InjectDataSource } from '@nestjs/typeorm';
import { EMPTY, from, firstValueFrom, catchError, map, take, of } from 'rxjs';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    @InjectDataSource()
    private readonly dataSource: DataSource,
  ) {}

  async createNewUser(userCreateDto: UserCreateDto): Promise<any> {
    try {
      const alreadyExist = await firstValueFrom(
        from(this.findUserByUsername(userCreateDto.username)).pipe(
          catchError(() => of(void 0)),
        ),
      );

      if (alreadyExist)
        throw new ConflictException(
          `User ${userCreateDto.username} already exist`,
        );

      const newUser = await this.dataSource.transaction(
        async (manager): Promise<User> => {
          const UserToCreate = manager.create(User, {
            username: userCreateDto.username,
            password: userCreateDto.password,
          });

          const user = await manager.save(User, UserToCreate);

          const account = manager.create(Account, { user });

          await manager.save(Account, account);
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

      if (!user) throw new Error();

      return user;
    } catch (error) {
      throw new NotFoundException(`User ${username} not found`);
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
