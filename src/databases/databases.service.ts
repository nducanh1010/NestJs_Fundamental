import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import {
  Permission,
  PermissionDocument,
} from 'src/permissions/schemas/permission.schema';
import { Role, RoleDocument } from 'src/roles/schemas/role.schema';
import { User, UserDocument } from 'src/users/schemas/user.schema';
import { UsersService } from 'src/users/users.service';
import { ADMIN_ROLE, INIT_PERMISSIONS, USER_ROLE } from './sample';
import passport from 'passport';

@Injectable()
export class DatabasesService implements OnModuleInit {
  private readonly logger = new Logger(DatabasesService.name);
  constructor(
    @InjectModel(Role.name)
    private roleModel: SoftDeleteModel<RoleDocument>,
    @InjectModel(Permission.name)
    private permissionModel: SoftDeleteModel<PermissionDocument>,
    @InjectModel(User.name)
    private userModel: SoftDeleteModel<UserDocument>,
    private configService: ConfigService,
    private userService: UsersService,
  ) {}
  async onModuleInit() {
    const isInit = this.configService.get<string>('SHOULD_INIT');
    if (Boolean(isInit)) {
      const countUser = await this.userModel.count({});
      const countPermission = await this.permissionModel.count({});
      const countRole = await this.roleModel.count({});
      //create permissions
      if (countPermission === 0) {
        await this.permissionModel.insertMany(INIT_PERMISSIONS);
        // bulk create taoj nh
      }
      // create role
      if (countRole === 0) {
        const permissions = await this.permissionModel.find({}).select('_id');
        await this.roleModel.insertMany([
          {
            name: ADMIN_ROLE,
            description: 'full access',
            isActive: true,
            permissions: permissions,
          },
          {
            name: USER_ROLE,
            description: 'Người dùng, ứng viên hệ thống',
            isActive: true,
            permissions: [], // không set quyền, chỉ add Role
          },
        ]);
      }
      if(countUser===0){
        const adminRole= await this.roleModel.findOne({name:ADMIN_ROLE})
        const userRole= await this.roleModel.findOne({name:USER_ROLE})
        await this.userModel.insertMany([
            {
                name:'the super ultimate admin ',
                email:"admin@gmail.com",
                password:this.userService.gethashPassword(this.configService.get<string>("INIT_PASSWORD")),
                age:23,
                gender:"MALE",
                address:"Viet Nam",
                role:adminRole?._id
            },
            {
                name:'Duc Anh',
                email:"nducanh1010@gmail.com",
                password:this.userService.gethashPassword(this.configService.get<string>("INIT_PASSWORD")),
                age:23,
                gender:"MALE",
                address:"Viet Nam",
                role:adminRole?._id
            },
            {
                name:'BabyghostCrab',
                email:"babyghostcrab_kiwikiwi@gmail.com",
                password:this.userService.gethashPassword(this.configService.get<string>("INIT_PASSWORD")),
                age:23,
                gender:"MALE",
                address:"Viet Nam",
                role:userRole?._id
            }
        ])
      }
      // nếu có rồi thông báo lên đã tạo rồi
      if(countUser>0&&countRole>0&&countPermission>0){
        this.logger.log('>>>ALREADY INIT SAMPLE DATA')
      }
    }
  }
}
