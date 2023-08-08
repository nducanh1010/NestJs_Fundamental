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
import { JobsService } from './jobs.service';
import { CreateJobDto } from './dto/create-job.dto';
import { UpdateJobDto } from './dto/update-job.dto';
import { Public, ResponseMessage, User } from '../decorator/customize';
import { IUser } from '../users/user.interface';
import { ApiTags } from '@nestjs/swagger';
@ApiTags('Job')
@Controller('jobs')
export class JobsController {
  constructor(private readonly jobsService: JobsService) {}

  @Post()
  @ResponseMessage('create a new job')
  create(@Body() createJobDto: CreateJobDto, @User() user: IUser) {
    return this.jobsService.create(createJobDto, user);
  }
  @Public()
  @Get()
  @ResponseMessage('Fetch jobs with pagination')
  findAll(
    @Query('current') currentPage: string, //req.query.page
    @Query('pageSize') limit: string,
    @Query() qs: string, // req.query
  ) {
    return this.jobsService.findAll(+currentPage, +limit, qs);
  }
  @Public()
  @Get(':id')
  @ResponseMessage('Get a job by id')
  findOne(@Param('id') id: string) {
    return this.jobsService.findOne(id);
  }

  @Patch(':id')
  @ResponseMessage('Update a job')
  update(
    @Param('id') id: string,
    @Body() updateJobDto: UpdateJobDto,
    @User() user: IUser,
  ) {
    return this.jobsService.update(id, updateJobDto, user);
  }

  @Delete(':id')
  @ResponseMessage('Delete a job')
  remove(@Param('id') id: string, @User() user: IUser) {
    return this.jobsService.remove(id, user);
  }
}
