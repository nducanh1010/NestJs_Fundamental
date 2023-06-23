import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private configService : ConfigService
  ) {
    super({
      // giải mã token
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>("JWT_SECRET"),
    });
  }
// data nhận được chạy vào hàm validate viết sẵn, tuwjd dộng điền vào req.user  
  async validate(payload: any) {
    return { userId: payload.sub, username: payload.username };
  }
}