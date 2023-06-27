import { Controller, Get, Render, Post, UseGuards, Request } from '@nestjs/common';
import { AppService } from './app.service';
import { ConfigService } from '@nestjs/config';
import { LocalAuthGuard } from './auth/local-auth.guard';
import { AuthService } from './auth/auth.service';
import { Public } from './decorator/customize';
@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private configService: ConfigService,
    private authService:AuthService
  ) {}
  @Public()
  // decorator thằng use guard tự động xử lí phần login
  @UseGuards(LocalAuthGuard)  
  @Post('auth/login')
  handleLogin(@Request() req) {
    return this.authService.login(req.user);   // trả về 1 object, bên trong là access token
  }
  // khai báo jwt auth gurad, xử lí token sẽ do jwt.strategy xử lí (encode decode), import strategy vào auth module
  // @UseGuards(JwtAuthGuard) 
  @Public()
  @Get('profile')
  getProfile(@Request() req) {
    return req.user;
  }
}
