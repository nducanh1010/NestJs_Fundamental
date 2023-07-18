import {Controller, Get, Post, Body, Patch, Param, Delete, Query} from '@nestjs/common';
import { JobsService } from './jobs.service';
import { CreateJobDto } from './dto/create-job.dto';
import { UpdateJobDto } from './dto/update-job.dto';
import {ResponseMessage, User} from "../decorator/customize";
import {IUser} from "../users/user.interface";
import {InjectModel} from "@nestjs/mongoose";
import {Job, JobDocument} from "./schemas/job.schema";
import {SoftDeleteModel} from "soft-delete-plugin-mongoose";


@Controller('jobs')
export class JobsController {
  constructor(
      @InjectModel(Job.name)
      private jobModel:SoftDeleteModel<JobDocument>
  ) {}

  @Post()
  @ResponseMessage('create a new job')
  create(@Body() createJobDto: CreateJobDto,@User() user:IUser) {
    return this.jobsService.create(createJobDto,user);
  }

  @Get()
  @ResponseMessage('Fetch jobs with pagination')
  findAll() {
    return this.jobsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.jobsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateJobDto: UpdateJobDto) {
    return this.jobsService.update(+id, updateJobDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.jobsService.remove(+id);
  }
}
