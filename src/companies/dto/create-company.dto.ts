import {IsNotEmpty } from "class-validator";

//data transfer object // class = object
export class CreateCompanyDto {
    @IsNotEmpty({
       message: 'Tên không được để trống'
    })
    name:string;
    @IsNotEmpty({
        message:'Địa chỉ không được để trống'
    })
    adress:string;
    @IsNotEmpty({
        message:'Mô tả không được để trống'
    })
   description:string
}
