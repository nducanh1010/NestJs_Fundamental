import { Module } from '@nestjs/common';
import { FilesService } from './files.service';
import { FilesController } from './files.controller';
import { MulterModule } from '@nestjs/platform-express';
import { MulterConfigService } from './multer.config';

@Module({
  controllers: [FilesController],
  providers: [FilesService],
  imports: [
    MulterModule.registerAsync({    // config để dùng thư viện uplaod file multer module
      useClass: MulterConfigService,
    }),
  ],
})
export class FilesModule {}
