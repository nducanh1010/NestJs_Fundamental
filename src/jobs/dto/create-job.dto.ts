
import {IsNotEmpty} from "class-validator";
//data transfer object // class = object
export class CreateJobDto {
    @IsNotEmpty({
        message: 'Tên không được để trống'
    })
    name:string;
    @IsNotEmpty({
        message:'Kĩ năng không được để trống'
    })
    skills:string;
    @IsNotEmpty({
        message:'Địa chỉ công ti không được để trống'
    })
    location:string
    @IsNotEmpty({
        message:'Lương vị trí không được để trống'
    })
    salary:number
}