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
import { SubscribersService } from './subscribers.service';

import { Public, ResponseMessage, SkipCheckPermission, User } from '../decorator/customize';
import { IUser } from '../users/user.interface';
import { UpdateSubscriberDto } from './dto/update-subscriber.dto';
import { CreateSubscriberDto } from './dto/create-subscriber.dto';
import { ApiTags } from '@nestjs/swagger';
@ApiTags('Subscriber')
@Controller('subscribers')
export class SubscribersController {
  constructor(private readonly subscribersService: SubscribersService) {}

  @Post()
  @ResponseMessage('create a new subscriber')
  create(
    @Body() createSubscriberDto: CreateSubscriberDto,
    @User() user: IUser,
  ) {
    return this.subscribersService.create(createSubscriberDto, user);
  }
  @Public()
  @Get()
  @ResponseMessage('Fetch subscribers with pagination')
  findAll(
    @Query('current') currentPage: string, //req.query.page
    @Query('pageSize') limit: string,
    @Query() qs: string, // req.query
  ) {
    return this.subscribersService.findAll(+currentPage, +limit, qs);
  }
  @Public()
  @Get(':id')
  @ResponseMessage('Get a subscriber by id')
  findOne(@Param('id') id: string) {
    return this.subscribersService.findOne(id);
  }
@Post('skills')
@ResponseMessage('Get Subscribers skills')
@SkipCheckPermission()
getUserSkills(@User()user:IUser){
  return this.subscribersService.getSkills(user)
}
  @Patch()
  @ResponseMessage('Update a subscriber')
  @SkipCheckPermission()
  update(
    @Body() updateSubscriberDto: UpdateSubscriberDto,
    @User() user: IUser,
  ) {
    return this.subscribersService.update( updateSubscriberDto, user);
  }

  @Delete(':id')
  @ResponseMessage('Delete a subscriber')
  remove(@Param('id') id: string, @User() user: IUser) {
    return this.subscribersService.remove(id, user);
  }
}
