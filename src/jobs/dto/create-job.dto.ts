import {
  IsArray,
  IsBoolean,
  IsDate,
  isNotEmpty,
  IsNotEmpty,
  IsNotEmptyObject,
  IsObject,
  IsString,
  ValidateNested,
} from 'class-validator';
import mongoose from 'mongoose';
import { Transform, Type } from 'class-transformer';

//data transfer object // class = object
class Company {
  // nested object
  @IsNotEmpty()
  _id: mongoose.Schema.Types.ObjectId;
  @IsNotEmpty()
  name: String;
}

export class CreateJobDto {
  @IsNotEmpty({
    message: 'Tên không được để trống',
  })
  name: string;
  @IsNotEmpty({
    message: 'Skills không được để trống',
  })
  @IsArray({ message: 'Skills định dạng là array' })
  @IsString({ message: 'Skills định dạng là string', each: true }) // each sẽ kiểm tra từng phần tử trong array
  skills: string[];
  @IsNotEmptyObject()
  @IsObject()
  @ValidateNested()
  @Type(() => Company)
  company: Company;
  @IsNotEmpty({
    message: 'Lương vị trí không được để trống',
  })
  salary: number;
  @IsNotEmpty({
    message: 'Logo không được để trống',
  })
  logo: string;
  @IsNotEmpty({ message: 'Quantity không được để trống ' })
  quantity: number;
  @IsNotEmpty({ message: 'Location không được để trống ' })
  location: string;
  @IsNotEmpty({ message: 'Level không được để trống ' })
  level: string;
  @IsNotEmpty({ message: 'Description không được để trống ' })
  description: string;
  @IsNotEmpty({ message: 'StartDate không được để trống ' })
  @Transform(({ value }) => new Date(value))
  @IsDate({ message: 'startDate có định dạng là date' })
  startDate: Date;
  @IsNotEmpty({ message: 'endDate không được để trống ' })
  @Transform(({ value }) => new Date(value)) // convert dữ liệu từ string sang date
  @IsDate({ message: 'endDate có định dạng là date' })
  endDate: Date;
  @IsNotEmpty({ message: 'isActive không được để trống ' })
  @IsBoolean({ message: 'isActive có định dạng là boolean' })
  isActive: boolean;
}
