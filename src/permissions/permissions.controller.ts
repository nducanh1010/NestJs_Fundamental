import {Controller, Get, Post, Body, Patch, Param, Delete, Query} from '@nestjs/common';
import { PermissionsService } from './permissions.service';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { UpdatePermissionDto } from './dto/update-permission.dto';
import {IUser} from "../users/user.interface";
import {ResponseMessage, User} from "../decorator/customize";
import { ApiTags } from '@nestjs/swagger';
@ApiTags('Permission')
@Controller('permissions')
export class PermissionsController {
  constructor(private readonly permissionsService: PermissionsService) {}

  @Post()
  @ResponseMessage('Create a new permission')
  create(@Body() createPermissionDto: CreatePermissionDto, @User() user:IUser) {
    return this.permissionsService.create(createPermissionDto,user);
  }

  @Get()
  @ResponseMessage('Fetch permission with pagination')
  findAll(
      @Query('current') currentPage: string, //req.query.page
      @Query('pageSize') limit: string,
      @Query() qs: string, // req.query
  ) {
    return this.permissionsService.findAll(+currentPage, +limit, qs);
  }

  @Get(':id')
  @ResponseMessage('Fetch permission with id')
  findOne(@Param('id') id: string) {
    return this.permissionsService.findOne(id);
  }

  @Patch(':id')
  @ResponseMessage('Update a permission with id')
  update(@Param('id') id: string, @Body() updatePermissionDto: UpdatePermissionDto,@User() user:IUser) {
    return this.permissionsService.update(id, updatePermissionDto,user);
  }

  @Delete(':id')
  @ResponseMessage('Remove a permission with Id')
  remove(@Param('id') id: string,@User() user:IUser) {
    return this.permissionsService.remove(id,user);
  }
}
