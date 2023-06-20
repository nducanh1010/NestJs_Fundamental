import { OmitType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';

export class UpdateUserDto  extends OmitType(CreateUserDto, ['password'] as const) {
    _id:string;
} // Omit tức là bỏ đi trường nào đó k cập nahatj
