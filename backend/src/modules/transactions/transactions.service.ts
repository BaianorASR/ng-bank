import { Account, Transaction, User } from '@database/entities';
import { ICurrentUser } from '@interfaces/current-user.interface';
import { UsersService } from '@modules/users/users.service';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { SendToDto } from './dtos/sender-to.dto';

@Injectable()
export class TransactionsService {
  constructor(
    @InjectDataSource()
    private readonly dataSource: DataSource,
    private readonly usersService: UsersService,
  ) {}

  async createTransaction(
    sendTo: SendToDto,
    currentUser: ICurrentUser,
  ): Promise<Transaction> {
    try {
      const transaction = await this.dataSource.transaction(
        async (manager): Promise<Transaction> => {
          const creditedAccount = await this.usersService.findUserByUsername(
            sendTo.username,
          );

          const debitedAccount = await this.usersService.findUserById(
            currentUser.userId,
          );

          console.log({ creditedAccount, debitedAccount });

          const transaction = manager.create(Transaction, {
            value: Number(sendTo.value).toFixed(2),
            creditedAccount: { id: creditedAccount.account.id },
            debitedAccount: { id: debitedAccount.account.id },
          });

          await manager.save(Transaction, transaction);
          return transaction;
        },
      );

      return transaction;
    } catch (error) {
      console.log(error);

      throw new InternalServerErrorException(error.message);
    }
  }
}
