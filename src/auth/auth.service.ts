import {BadRequestException, Injectable} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import { IUser } from '../users/user.interface';
import { RegisterUserDto } from 'src/users/dto/create-user.dto';
import { ConfigService } from '@nestjs/config';
import ms from 'ms';
import { Response } from 'express';

@Injectable()
export class AuthService {
  constructor(
    private configService: ConfigService,
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  // username/  pass là 2 tham số thư viện passport
  async validateUser(username: string, pass: string): Promise<any> {
    const user = await this.usersService.findOneByUserName(username);
    if (user) {
      const isvalid = this.usersService.IsValidPassword(pass, user.password); // gọi đến bcrypt userservice
      if (isvalid === true) {
        return user;
      }
    }
    return null;
  }
  createRefreshToken = (payload) => {
    const refreshToken = this.jwtService.sign(payload, {
      secret: this.configService.get<string>('JWT_REFRESH_TOKEN_SECRET'),
      expiresIn:
        ms(this.configService.get<string>('JWT_REFRESH_EXPIRE')) / 1000,
    });
    return refreshToken;
  };

  async login(user: IUser, response: Response) {
    const { _id, name, email, role } = user;
    const payload = {
      sub: 'token login',
      iss: 'from server',
      _id,
      name,
      email,
      role,
    };
    const refresh_token = this.createRefreshToken(payload);
    // update user with refresh token
    await this.usersService.updateUserToken(refresh_token, _id);
    // set refresh_token as cookies
    response.cookie('refresh_token', refresh_token, {
      httpOnly: true,
      maxAge: ms(this.configService.get<string>('JWT_REFRESH_EXPIRE'))*1000, //milisecond
    });
    return {
      access_token: this.jwtService.sign(payload),
      user: {
        _id,
        name,
        email,
        role,
      },
    };
  }
processNewToken(refresh_token :string){
 try {
this.jwtService.verify(refresh_token,{
  secret:this.configService.get<string>("JWT_REFRESH_TOKEN_SECRET")
})
 }
 catch (error){
   throw new BadRequestException('Refresh token không hợp lệ, vui lòng đăng nhập lại');
 }
}
  async register(user: RegisterUserDto) {
    let newUser = await this.usersService.register(user); // sử dụng để chọc vào db th user
    return {
      _id: newUser?._id,
      createdAt: newUser?.createdAt,
    };
  }
}
