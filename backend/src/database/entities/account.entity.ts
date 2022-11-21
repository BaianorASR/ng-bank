import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { PreconditionFailedException } from '@nestjs/common';

import { Transaction } from './transaction.entity';
import { User } from './user.entity';

@Entity('accounts')
export class Account {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: '100.00' })
  balance: string;

  @OneToOne(() => User, (user) => user.account)
  user: User;

  @OneToMany(() => Transaction, (transaction) => transaction.debitedAccount)
  debitedTransactions: Transaction[];

  @OneToMany(() => Transaction, (transaction) => transaction.creditedAccount)
  creditedTransactions: Transaction[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;

  hasEnoughBalance(amount: number): void {
    if (parseFloat(this.balance) < amount)
      throw new PreconditionFailedException('Insufficient balance');
  }
}
