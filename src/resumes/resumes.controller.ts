import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  BadRequestException,
  Query,
  Res,
} from '@nestjs/common';
import { ResumesService } from './resumes.service';
import { CreateUserCvDTO } from './dto/create-resume.dto';
import mongoose from 'mongoose';
import { ResponseMessage, User } from '../decorator/customize';
import { IUser } from '../users/user.interface';
import { ApiTags } from '@nestjs/swagger';
@ApiTags('Resume')
@Controller('resumes')
export class ResumesController {
  constructor(private readonly resumesService: ResumesService) {}

  @Post()
  @ResponseMessage('Create a new resume')
  create(@Body() createUserCvDTO: CreateUserCvDTO, @User() user: IUser) {
    return this.resumesService.create(createUserCvDTO, user);
  }
  @Post('by-user')
  @ResponseMessage('Get all CV by user')
  getResumesByUser(@User() user: IUser) {
    return this.resumesService.findByUsers(user);
  }
  @Get()
  @ResponseMessage('Fetch all resumes with pagination')
  findAll(
    @Query('current') currentPage: string, //req.query.page
    @Query('pageSize') limit: string,
    @Query() qs: string, // req.query
  ) {
    return this.resumesService.findAll(+currentPage, +limit, qs);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new BadRequestException(`not found company with id ${id}`);
    }
    return this.resumesService.findOne(id); // lỗi 500
  }
  @Patch(':id')
  @ResponseMessage('Update status resume')
  updateStatus(
    @Param('id') id: string,
    @Body('status') status: string,
    @User() user: IUser,
  ) {
    return this.resumesService.update(id, status, user);
  }
  // @Patch(':id')
  // @ResponseMessage('Update a resume')
  // update(@Param('id') id: string, @Body() updateResumeDto: UpdateResumeDto) {
  //   return this.resumesService.update(+id, updateResumeDto);
  // }
  @Delete(':id')
  @ResponseMessage('Delete a resumes')
  remove(@Param('id') id: string, @User() user: IUser) {
    return this.resumesService.remove(id, user);
  }
}
