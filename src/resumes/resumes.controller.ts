import {Controller, Get, Post, Body, Patch, Param, Delete, BadRequestException} from '@nestjs/common';
import { ResumesService } from './resumes.service';
import { CreateResumeDto } from './dto/create-resume.dto';
import { UpdateResumeDto } from './dto/update-resume.dto';
import mongoose from "mongoose";
import {ResponseMessage, User} from "../decorator/customize";
import {IUser} from "../users/user.interface";

@Controller('resumes')
export class ResumesController {
  constructor(private readonly resumesService: ResumesService) {}

  @Post()
  @ResponseMessage('Create a new resume')
  create(@Body() createResumeDto: CreateResumeDto, @User()user :IUser) {
    return this.resumesService.create(createResumeDto,user);
  }

  @Get()
  findAll() {
    return this.resumesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    if(!mongoose.Types.ObjectId.isValid(id)){
      throw  new BadRequestException(`not found company with id ${id}`)
    }
    return this.resumesService.findOne(id); // lỗi 500
  }
  @Patch(':id')
  @ResponseMessage('Update status resume')
  updateStatus(@Param('id') id: string,@Body("status")status:string, @User() user:IUser) {
    return this.resumesService.update(id,status,user);
  }
  // @Patch(':id')
  // @ResponseMessage('Update a resume')
  // update(@Param('id') id: string, @Body() updateResumeDto: UpdateResumeDto) {
  //   return this.resumesService.update(+id, updateResumeDto);
  // }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.resumesService.remove(+id);
  }
}
