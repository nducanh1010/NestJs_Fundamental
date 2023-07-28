import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema, User } from './schemas/user.schema';
import { Role, RoleSchema } from 'src/roles/schemas/role.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: User.name, // gán id dựa vào user.name
        schema: UserSchema,
      },
      {
        name: Role.name, 
        schema: RoleSchema,
      },
    ]), // đăng kí 1 module để Nestjs hiểu name như định danh
  ],
  controllers: [UsersController],
  providers: [UsersService],
  exports:[UsersService]  // cấu trúc quản lý chặt chẽ, muốn gọi services ở module khác cần sử dụng export ( Cú pháp dependencies injection)
})
export class UsersModule {}
