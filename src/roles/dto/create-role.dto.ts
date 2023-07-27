import { IsArray, IsBoolean, IsMongoId, IsNotEmpty } from 'class-validator';
import mongoose from 'mongoose';

export class CreateRoleDto {
  @IsNotEmpty({ message: 'name không được để trống' })
  name: string;
  @IsNotEmpty({ message: 'description không được để trống' })
  description: string;
  @IsNotEmpty({ message: 'isActive không được để trống' })
  @IsBoolean({ message: 'isActive có giá trị là boolean' })
  isActive: boolean;
  @IsNotEmpty({ message: 'Permissions không được để trống' })
  @IsMongoId({ message: 'each permission must be a mongo id' })
  @IsArray({ message: 'Permissions có định dạng là array' })
  permissions: mongoose.Schema.Types.ObjectId[]; // giá trị truyền vào là 1 list array id
}
