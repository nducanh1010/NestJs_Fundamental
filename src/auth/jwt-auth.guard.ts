import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
//AuthGuard, giống như 1 cái middleware, check xem có sử dụng strategy hay không
export class JwtAuthGuard extends AuthGuard('jwt') {}   
