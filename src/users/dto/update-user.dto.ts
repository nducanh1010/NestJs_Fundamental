import { OmitType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import { IsNotEmpty } from 'class-validator';

export class UpdateUserDto extends OmitType(CreateUserDto, [
  'password',
] as const) {
  @IsNotEmpty({ message: ' _id đang để trống' })
  _id: string;
} // Omit tức là bỏ đi trường nào đó k cập nahatj, trong trường hợp này là password
