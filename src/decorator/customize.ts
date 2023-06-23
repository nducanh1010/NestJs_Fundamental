import { SetMetadata } from '@nestjs/common';  //ioongs kiểu dữ liệu đính kèm với file

export const IS_PUBLIC_KEY = 'isPublic';
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);