import { Controller, Get, Render, Post, UseGuards, Request } from '@nestjs/common';
import { AppService } from './app.service';
import { ConfigService } from '@nestjs/config';
import { AuthGuard } from '@nestjs/passport';
import { LocalAuthGuard } from './auth/local-auth.guard';
@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private configService: ConfigService,
  ) {}
  @UseGuards(LocalAuthGuard)  // decorator thằng use guard tự động xử lí phần login
  @Post('auth/login')
  handleLogin(@Request() req) {
    return req.user;   // đây là dữ liệu trả về do thằng passport đã xử lí rồi
  }
}
