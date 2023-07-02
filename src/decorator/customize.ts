import {createParamDecorator, ExecutionContext, SetMetadata} from '@nestjs/common';  //ioongs kiểu dữ liệu đính kèm với file

export const IS_PUBLIC_KEY = 'isPublic';
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);
// Mục đích: passing request to service => lấy thông tin users đang đăng nhập
//decorator/customize.ts
export const User = createParamDecorator(
    (data: unknown, ctx: ExecutionContext) => {
        const request = ctx.switchToHttp().getRequest();
        return request.user;
    },
);
