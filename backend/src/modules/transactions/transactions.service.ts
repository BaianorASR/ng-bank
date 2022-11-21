import { Transaction } from '@database/entities';
import { ICurrentUser } from '@interfaces/current-user.interface';
import { IPaginationOptions } from '@interfaces/pagination-params.interface';
import { UsersService } from '@modules/users/users.service';
import { Injectable } from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { SendCashInToDto } from './dtos/sender-to.dto';

@Injectable()
export class TransactionsService {
  constructor(
    @InjectRepository(Transaction)
    private readonly transactionRepository: Repository<Transaction>,
    @InjectDataSource()
    private readonly dataSource: DataSource,
    private readonly usersService: UsersService,
  ) {}

  async getTransactions(
    currentUser: ICurrentUser,
    paginationOptions: IPaginationOptions,
  ): Promise<[Transaction[], number]> {
    try {
      const user = await this.usersService.findUserById(currentUser.userId);

      const transactions = await this.transactionRepository
        .createQueryBuilder('transaction')
        .leftJoinAndSelect('transaction.creditedAccount', 'creditedAccount')
        .leftJoinAndSelect('transaction.debitedAccount', 'debitedAccount')
        .where('creditedAccount.id = :id', { id: user.account.id })
        .orWhere('debitedAccount.id = :id', { id: user.account.id })
        .andWhere('transaction.createdAt >= :startDate', {
          startDate: paginationOptions.startDate,
        })
        .andWhere('transaction.createdAt <= :endDate', {
          endDate: paginationOptions.endDate,
        })
        .orderBy(
          `transaction.${paginationOptions.sort}`,
          paginationOptions.order,
        )
        .skip(paginationOptions.page - 1 * paginationOptions.limit)
        .take(paginationOptions.limit)
        .getManyAndCount();

      return transactions;
    } catch (error) {
      throw error;
    }
  }

  async cashIn(
    sendCashInToDto: SendCashInToDto,
    currentUser: ICurrentUser,
  ): Promise<Transaction> {
    try {
      const transaction = await this.dataSource.transaction(
        async (manager): Promise<Transaction> => {
          const creditedAccount = await this.usersService.findUserByUsername(
            sendCashInToDto.username,
          );

          const debitedAccount = await this.usersService.findUserById(
            currentUser.userId,
          );

          debitedAccount.account.hasEnoughBalance(
            parseFloat(sendCashInToDto.amount),
          );

          const transaction = manager.create(Transaction, {
            value: Number(sendCashInToDto.amount).toFixed(2),
            creditedAccount: { id: creditedAccount.account.id },
            debitedAccount: { id: debitedAccount.account.id },
          });

          await manager.save(Transaction, transaction);
          return transaction;
        },
      );

      return transaction;
    } catch (error) {
      throw error;
    }
  }
}
