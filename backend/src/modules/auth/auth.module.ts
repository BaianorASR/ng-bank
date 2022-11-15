import { UsersModule } from '@modules/users/users.module';
import { Module } from '@nestjs/common';
import { LocalAuthStrategy } from '@strategies/local-auth.strategy';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

@Module({
  imports: [UsersModule],
  controllers: [AuthController],
  providers: [AuthService, LocalAuthStrategy],
})
export class AuthModule {}
