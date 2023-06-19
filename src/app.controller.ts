import { Controller, Get, Render } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @Render("home") //render từ sever ko co return
  getHello(){
    // return this.appService.getHello();
  }
}
