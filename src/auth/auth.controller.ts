import {
    Controller,
    Get,
    Render,
    Post,
    UseGuards,
    Body,
    Res, Req,
    Request
} from '@nestjs/common';
import {AuthService} from './auth.service';
import {Public, ResponseMessage, User} from '../decorator/customize';
import {LocalAuthGuard} from './local-auth.guard';
import {CreateUserDto, RegisterUserDto} from 'src/users/dto/create-user.dto';
import {Response, Request as RequestExpress} from 'express';
import {IUser} from 'src/users/user.interface';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {
    }

    @Public()
    // decorator thằng use guard tự động xử lí phần login
    @UseGuards(LocalAuthGuard)
    @Post('/login')
    @ResponseMessage('User login ')
    handleLogin(@Request() req, @Res({passthrough: true}) response: Response) {
        return this.authService.login(req.user, response); // trả về 1 object, bên trong là access token
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
    register(@Body() registeruserDto: RegisterUserDto) {
        return this.authService.register(registeruserDto);
    }

    @Get('/account')
    @ResponseMessage('Get user information')
    handleGetAccount(@User() user: IUser) { //req.user
        return {user};
    }

    @Public()
    @Get('/refresh')
    @ResponseMessage('Get user by refresh token')
    // nếu refresh token lưu ở cookies hoàn toàn hợp lệ, lấy được access token mới
    handleRefreshToken(@Req() req: RequestExpress, @Res({passthrough: true}) response: Response) {
        const refreshToken = req.cookies['refresh_token']
        return this.authService.processNewToken(refreshToken, response)
    }
}
