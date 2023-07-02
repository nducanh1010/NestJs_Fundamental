import { PartialType } from '@nestjs/mapped-types';
import { CreateCompanyDto } from './create-company.dto';
import {IsNotEmpty} from "class-validator";

export class UpdateCompanyDto extends PartialType(CreateCompanyDto) {
    // với Partial k cần validate nữa do đã extend th create Company dto rồi
}
