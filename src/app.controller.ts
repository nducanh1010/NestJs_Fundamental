import { Controller, Get, Render, Post, UseGuards, Request } from '@nestjs/common';
import { AppService } from './app.service';
import { ConfigService } from '@nestjs/config';
import { AuthGuard } from '@nestjs/passport';
import { LocalAuthGuard } from './auth/local-auth.guard';
import { AuthService } from './auth/auth.service';
@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private configService: ConfigService,
    private authService:AuthService
  ) {}
  @UseGuards(LocalAuthGuard)  // decorator thằng use guard tự động xử lí phần login
  @Post('auth/login')
  handleLogin(@Request() req) {
    return this.authService.login(req.user);   // đây là dữ liệu trả về do thằng passport đã xử lí rồi
  }
}
