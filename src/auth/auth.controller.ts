import { Controller, Get, Render, Post, UseGuards, Request, Body } from '@nestjs/common';
import {AuthService} from "./auth.service";
import {Public, ResponseMessage} from "../decorator/customize";
import {LocalAuthGuard} from "./local-auth.guard";
import { CreateUserDto, RegisterUserDto } from 'src/users/dto/create-user.dto';

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
    @Public()
    @Post('register')
    @ResponseMessage('Register a new user !!')

    register(@Body() registeruserDto:RegisterUserDto ){
        return this.authService.register(registeruserDto)
    }
}
