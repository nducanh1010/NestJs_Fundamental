import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {IUser} from "../../users/user.interface";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private configService: ConfigService) {
    super({
      // giải mã token
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_ACCESS_TOKEN_SECRET'),
    });
  }
  // data nhận được chạy vào hàm validate viết sẵn, tuwjd dộng điền vào req.user
  async validate(payload: IUser ) {
    const{_id,name,role,email}=payload
    //req.user
    return{
      _id,
      name,
      role,
      email
    }
  }
}
