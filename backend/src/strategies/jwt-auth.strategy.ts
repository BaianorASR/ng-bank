import { ExtractJwt, Strategy } from 'passport-jwt';

import { ICurrentUser, IJwtTokenPayload } from '@interfaces';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';

@Injectable()
export class JwtAuthStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET'),
    });
  }

  async validate(payload: IJwtTokenPayload): Promise<ICurrentUser> {
    return { userId: payload.sub, username: payload.username };
  }
}
