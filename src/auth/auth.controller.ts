import { Controller, Get, Render, Post, UseGuards, Request } from '@nestjs/common';
import {AuthService} from "./auth.service";
import {Public} from "../decorator/customize";
import {LocalAuthGuard} from "./local-auth.guard";

@Controller('auth')
export class AuthController {
    constructor(
        private authService:AuthService
    ) {}
    @Public()
    // decorator thằng use guard tự động xử lí phần login
    @UseGuards(LocalAuthGuard)
    @Post('/login')
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
