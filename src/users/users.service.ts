import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './schemas/user.schema';
import mongoose, { Model } from 'mongoose';
import { compareSync, genSaltSync, hashSync } from 'bcryptjs';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) // tiêm được vào mongoose
    private userModel: SoftDeleteModel<UserDocument>, // ép kiểu giá trị là 1 Model của mongoose. soft delete là xóa mềm, hox trợ khôi phục
  ) {}
  gethashPassword = (password: string) => {
    const salt = genSaltSync(10);
    const hash: string = hashSync(password, salt);
    return hash;
  };

  async create(
    // email: string, password: string, name: string
    createUserDto: CreateUserDto,
  ) {
    const hashPassword = this.gethashPassword(createUserDto.password);
    let user = await this.userModel.create({
      email: createUserDto.email,
      password: hashPassword,
      name: createUserDto.name,
      address: createUserDto.address,
    }); // chú ý yêu cầu { } truyền vào như 1 object
    return user;
  }

  findAll() {
    return `This action returns all users`;
  }

  findOne(id: string) {
    if (!mongoose.Types.ObjectId.isValid(id)) return 'not found user';
    return this.userModel.findOne({
      _id: id,
    });
  }
  findOneByUserName(username: string) {
    return this.userModel.findOne({
      email: username,
    });
  }
IsValidPassword(password:string, hash: string){
  return compareSync(password,hash) 
}
  async update(updateUserDto: UpdateUserDto) {
    return await this.userModel.updateOne(
      {
        _id: updateUserDto._id, // filter user by id
      },
      { ...updateUserDto }, // update data từ request body truyền vào
    );
  }

  remove(id: string) {
    if (!mongoose.Types.ObjectId.isValid(id)) return 'not found user';
    return this.userModel.softDelete({ _id: id });
  }
}
