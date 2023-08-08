import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { RolesService } from './roles.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { ResponseMessage, SkipCheckPermission, User } from 'src/decorator/customize';
import { IUser } from 'src/users/user.interface';

@Controller('roles')
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @Post()
  @ResponseMessage('Create a new role ')
  create(@Body() createRoleDto: CreateRoleDto, @User() user: IUser) {
    return this.rolesService.create(createRoleDto, user);
  }

  @Get()
  @ResponseMessage('Fetch roles with pagination')
  findAll(
    @Query('current') currentPage: string, //req.query.page
    @Query('pageSize') limit: string,
    @Query() qs: string, // req.query
  ) {
    return this.rolesService.findAll(+currentPage, +limit, qs);
  }

  @Get(':id')
  @ResponseMessage('Find one role by id')
  findOne(@Param('id') id: string) {
    return this.rolesService.findOne(id);
  }
  @Get('default/user')
  @SkipCheckPermission()
  @ResponseMessage('get default role')
  getDefaultRole() {
    return this.rolesService.getDefaultRole();
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateRoleDto: UpdateRoleDto,
    @User() user: IUser,
  ) {
    return this.rolesService.update(id, updateRoleDto, user);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @User() user: IUser) {
    return this.rolesService.remove(id, user);
  }
  
}
