import { BadRequestException, Injectable, Query } from '@nestjs/common';
import { CreateUserDto, RegisterUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User as UserM, UserDocument } from './schemas/user.schema';
import mongoose, { Model } from 'mongoose';
import { compareSync, genSaltSync, hashSync } from 'bcryptjs';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { IUser } from './user.interface';
import { User } from 'src/decorator/customize';
import aqp from 'api-query-params';
import { Role, RoleDocument } from 'src/roles/schemas/role.schema';
import { USER_ROLE } from 'src/databases/sample';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(UserM.name) // tiêm được vào mongoose
    private userModel: SoftDeleteModel<UserDocument>, // ép kiểu giá trị là 1 Model của mongoose. soft delete là xóa mềm, hox trợ khôi phục
    @InjectModel(Role.name)
    private roleModel: SoftDeleteModel<RoleDocument>,
  ) {}

  gethashPassword = (password: string) => {
    const salt = genSaltSync(10);
    const hash: string = hashSync(password, salt);
    return hash;
  };

  async create(
    // email: string, password: string, name: string
    createUserDto: CreateUserDto,
    @User() user: IUser,
  ) {
    const { address, age, company, email, gender, name, password, role } =
      createUserDto;
    const hashPassword = this.gethashPassword(password);
    const isExist = await this.userModel.findOne({ email });
    if (isExist) {
      throw new BadRequestException(
        `Email  ${email} đã tồn tại, vui lòng sử dụng email khác !`,
      );
    }
    const userNew = await this.userModel.create({
      email,
      password: hashPassword,
      name,
      address,
      age,
      company,
      gender,
      role,
      createdBy: {
        _id: user._id,
        email: user.email,
      },
    }); // chú ý yêu cầu { } truyền vào như 1 object
    return userNew;
  }

  async findAll(currentPage: number, limit: number, qs: string) {
    const { filter, sort, population } = aqp(qs);
    delete filter.current;
    delete filter.pageSize;
    let offset = (+currentPage - 1) * +limit; // bỏ qua bao nhiêu bản ghi
    let defaultLimit = +limit ? +limit : 10;
    const totalItems = (await this.userModel.find(filter)).length;
    const totalPages = Math.ceil(totalItems / defaultLimit); // tổng số trang
    const result = await this.userModel
      .find(filter)
      .skip(offset)
      .limit(defaultLimit)
      // @ts-ignore: Unreachable code error
      .sort(sort as any)
      .select('-password') // không trả về password
      .populate(population) // join bảng

      .exec();
    return {
      meta: {
        current: currentPage, //trang hiện tại
        pageSize: limit, //số lượng bản ghi đã lấy
        pages: totalPages, //tổng số trang với điều kiện query
        total: totalItems, // tổng số phần tử (số bản ghi)
      },
      result, //kết quả query
    };
  }

  async findOne(id: string) {
    if (!mongoose.Types.ObjectId.isValid(id)) return 'not found user';
    return await this.userModel
      .findOne({
        _id: id,
      })
      .select('-password') //exclude  ( cú pháp của mongoose), không trả về password
      .populate({ path: 'role', select: { name: 1, _id: 1 } });
  }

  findOneByUserName(username: string) {
    return this.userModel
      .findOne({
        email: username,
      })
      .populate({ path: 'role', select: { name: 1 } });
  }

  IsValidPassword(password: string, hash: string) {
    return compareSync(password, hash);
  }

  async update(updateUserDto: UpdateUserDto, @User() user: IUser) {
    console.log('update user dto', updateUserDto);

    const updatedUser = await this.userModel.updateOne(
      {
        _id: updateUserDto._id, // filter user by id
      },
      {
        ...updateUserDto,
        updatedBy: {
          _id: user._id,
          email: user.email,
        },
      }, // update data từ request body truyền vào
    );
    return updatedUser;
  }

  async remove(id: string, user: IUser) {
    if (!mongoose.Types.ObjectId.isValid(id)) return 'not found user';
    const foundUser = await this.userModel.findById(id);
    if (foundUser.email === 'admin@gmail.com') {
      throw new BadRequestException('Khong the xoa tai khoan admin@gmail.com ');
    }

    await this.userModel.updateOne(
      { _id: id },
      {
        deletedBy: {
          _id: user._id,
          email: user.email,
        },
      },
    );
    return this.userModel.softDelete({ _id: id });
  }

  async register(user: RegisterUserDto) {
    const { address, age, email, gender, name, password } = user;
    const isExist = await this.userModel.findOne({ email });
    if (isExist) {
      throw new BadRequestException(
        `Email  ${email} đã tồn tại, vui lòng sử dụng email khác !`,
      );
    }
    // fetch user role
    const userRole = await this.roleModel.findOne({ name: USER_ROLE });
    const hashPassword = this.gethashPassword(password);
    let newRegister = await this.userModel.create({
      name,
      email,
      age,
      address,
      gender,
      role: userRole?._id,
      password: hashPassword,
    });
    return newRegister;
  }
  updateUserToken = async (refreshToken: string, _id: string) => {
    return await this.userModel.updateOne(
      { _id },
      { refreshToken }, // short-hand cập nhật refresh_token bằng giá trị truyền vào cùng tên
    );
  };
  findUserByToken = async (refreshToken: string) => {
    return this.userModel.findOne({ refreshToken })
    .populate({
      path:'role',
      select:{name:1}
    }); // short-hand cập nhật refresh_token bằng giá trị truyền vào cùng tên
  };
}
