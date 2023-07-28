import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import { IUser } from '../users/user.interface';
import { RegisterUserDto } from 'src/users/dto/create-user.dto';
import { ConfigService } from '@nestjs/config';
import ms from 'ms';
import { Response } from 'express';
import { User } from '../decorator/customize';
import { RolesService } from 'src/roles/roles.service';

@Injectable()
export class AuthService {
  constructor(
    private configService: ConfigService,
    private usersService: UsersService,
    private jwtService: JwtService,
    private roleService: RolesService,
  ) {}

  // username/  pass là 2 tham số thư viện passport
  async validateUser(username: string, pass: string): Promise<any> {
    const user = await this.usersService.findOneByUserName(username);
    if (user) {
      const isvalid = this.usersService.IsValidPassword(pass, user.password); // gọi đến bcrypt userservice
      if (isvalid === true) {
        const userRole = user.role as unknown as { _id: string; name: string }; // gans lại kiểu tránh overlap ts
        const temp = await this.roleService.findOne(userRole._id);
        const objUser = {
          ...user.toObject(),
          permissions: temp?.permissions ?? [],
        };
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
    const { _id, name, email, role, permissions } = user;
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
      maxAge: ms(this.configService.get<string>('JWT_REFRESH_EXPIRE')), //milisecond
    });
    return {
      access_token: this.jwtService.sign(payload),
      user: {
        _id,
        name,
        email,
        role,
        permissions,
      },
    };
  }

  async processNewToken(refresh_token: string, response: Response) {
    try {
      this.jwtService.verify(refresh_token, {
        secret: this.configService.get<string>('JWT_REFRESH_TOKEN_SECRET'),
      });
      const user = await this.usersService.findUserByToken(refresh_token);
      if (user) {
        // update new refresh Token
        const { _id, name, email, role } = user;
        const payload = {
          sub: 'token refresh',
          iss: 'from server',
          _id,
          name,
          email,
          role,
        };
        // tạo refresh token mới
        const refresh_token = this.createRefreshToken(payload);
        // update user with refresh token
        await this.usersService.updateUserToken(refresh_token, _id.toString());
        const userRole = user.role as unknown as { _id: string; name: string }; // gans lại kiểu tránh overlap ts
        const temp = await this.roleService.findOne(userRole._id); // laays ra data để trả về permissions
        // set refresh_token as cookies
        response.clearCookie('refresh_token');
        response.cookie('refresh_token', refresh_token, {
          httpOnly: true,
          maxAge: ms(this.configService.get<string>('JWT_REFRESH_EXPIRE')), //milisecond
        });
        return {
          access_token: this.jwtService.sign(payload),
          user: {
            _id,
            name,
            email,
            role,
            permissions: temp?.permissions ?? [],
          },
        };
      } else {
        throw new BadRequestException(
          'Refresh token không hợp lệ, vui lòng đăng nhập lại',
        );
      }
    } catch (error) {
      throw new BadRequestException(
        'Refresh token không hợp lệ, vui lòng đăng nhập lại',
      );
    }
  }

  async register(user: RegisterUserDto) {
    let newUser = await this.usersService.register(user); // sử dụng để chọc vào db th user
    return {
      _id: newUser?._id,
      createdAt: newUser?.createdAt,
    };
  }
  async logout(response: Response, user: IUser) {
    await this.usersService.updateUserToken('', user._id);
    response.clearCookie('refresh_token');
    return 'ok';
  }
}
