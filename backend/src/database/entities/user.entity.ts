import * as bcrypt from 'bcrypt';
import {
  BeforeInsert,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  Index,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { InternalServerErrorException } from '@nestjs/common';

import { Account } from './account.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  @Index()
  username: string;

  @Column({ select: false })
  password: string;

  @OneToOne(() => Account)
  @JoinColumn()
  account: Account;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;

  @BeforeInsert()
  private async setLowercaseUsername(): Promise<void> {
    this.username = this.username.toLowerCase();
  }

  @BeforeInsert()
  private async setPassword(password: string): Promise<void> {
    try {
      if (this.password || password) {
        this.password = await bcrypt.hash(password || this.password, 10);
      }
    } catch (e) {
      throw new InternalServerErrorException(
        'There are some issues in the hash',
      );
    }
  }
}
