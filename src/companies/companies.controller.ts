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
import { CompaniesService } from './companies.service';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { Public, ResponseMessage, User } from '../decorator/customize';
import { IUser } from '../users/user.interface';
import { ApiTags } from '@nestjs/swagger';
@ApiTags('Company')
@Controller('companies')
export class CompaniesController {
  constructor(private readonly companiesService: CompaniesService) {}

  @Post()
  create(@Body() createCompanyDto: CreateCompanyDto, @User() user: IUser) {
    return this.companiesService.create(createCompanyDto, user); // taoj compan, nguười thêm
  }
  @Public()
  @Get()
  @ResponseMessage('Fetch list company with paginate')
  findAll(
    @Query('current') currentPage: string, //req.query.page
    @Query('pageSize') limit: string,
    @Query() qs: string, // req.query
  ) {
    // return {qs}
    // convert string sang number, sử dụng + tiền tố
    return this.companiesService.findAll(+currentPage, +limit, qs);
  }
  @Public()
  @Get(':id')
  findOne(@Param('id') id: string) { 
    return this.companiesService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateCompanyDto: UpdateCompanyDto,
    @User() user: IUser,
  ) {
    return this.companiesService.update(id, updateCompanyDto, user);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @User() user: IUser) {
    return this.companiesService.remove(id, user);
  }
}
