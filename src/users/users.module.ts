import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema, User } from './schemas/user.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]), // đăng kí 1 module để Nestjs hiểu name như định danh 
  ],
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}
