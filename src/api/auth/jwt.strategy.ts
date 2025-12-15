import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Request } from 'express';
import { AuthService } from './auth.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (req: Request) => {
          // xxxxxxxxxxxx | token get from query | xxxxxxxxxxxxx
          if (req.query && req.query.token) {
            return req.query.token as string;
          }

          // xxxxxxxxxxxxx | token get from header | xxxxxxxxxxxxx
          if (req.headers.authorization?.startsWith('Bearer ')) {
            return req.headers.authorization.split(' ')[1];
          }

          return null;
        },
      ]),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET || '',
    });
  }

  async validate(payload: { id: number; email: string; name: string }) {
    // console.log("payload :", payload);
    const user = await this.authService.findOne({
      id: payload.id,
      email: payload.email,
    });

    return user;
  }
}
