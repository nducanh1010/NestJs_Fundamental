import {
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { IS_PUBLIC_KEY } from 'src/decorator/customize';

@Injectable()
//AuthGuard, giống như 1 cái middleware, check xem có sử dụng strategy hay không
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private reflector: Reflector) {
    super();
  }
  canActivate(context: ExecutionContext) {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    //Guard sẽ return true, nếu bỏ Public vào sẽ bỏ qua checkguard
    if (isPublic) {
      return true;
    }
    return super.canActivate(context);
  }

  handleRequest(err, user, info, context: ExecutionContext) {
    const request: Request = context.switchToHttp().getRequest();
    // You can throw an exception based on either "info" or "err" arguments
    if (err || !user) {
      throw (
        err ||
        new UnauthorizedException(
          'Token không hợp lệ hoặc không có bearer token ở header',
        )
      );
    }
    // check permission
    const targetMethod = request.method;
    const targetEndpoint = request.route?.path;
    const permissions = user?.permissions ?? [];
    const isExist = permissions.find(
      (permit) =>
        targetMethod === permit.method && targetEndpoint == permit.apiPath,
    );
    if (!isExist) {
      throw new ForbiddenException('Bạn không có quyền truy cập end point này');
    }
    return user;
  }
}
