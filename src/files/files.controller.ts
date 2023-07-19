import {Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UploadedFile} from '@nestjs/common';
import {FilesService} from './files.service';
import {CreateFileDto} from './dto/create-file.dto';
import {UpdateFileDto} from './dto/update-file.dto';
import {FileInterceptor} from "@nestjs/platform-express";
import {Public} from "../decorator/customize";

@Controller('files')
export class FilesController {
    constructor(private readonly filesService: FilesService) {
    }

    @Public()
    @Post('upload')
    // middleware can thiệp vào file của NestJs, nhặt ra được fieldName, tên file, loại file, cỡ file, ..
    @UseInterceptors(FileInterceptor('file'))  // truyền form data, key : file
    uploadFile(@UploadedFile() file: Express.Multer.File) {
        console.log(file);
    }

    @Post()
    create(@Body() createFileDto: CreateFileDto) {
        return this.filesService.create(createFileDto);
    }

    @Get()
    findAll() {
        return this.filesService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.filesService.findOne(+id);
    }

    @Patch(':id')
    update(@Param('id') id: string, @Body() updateFileDto: UpdateFileDto) {
        return this.filesService.update(+id, updateFileDto);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.filesService.remove(+id);
    }
}
