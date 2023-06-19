import { Controller, Get, Render } from '@nestjs/common';
import { AppService } from './app.service';
import { ConfigService } from '@nestjs/config';
@Controller()
export class AppController {
  constructor(private readonly appService: AppService,
    private configService:ConfigService) {}

  @Get()
  @Render("home") //render từ sever ko co return
  handleHomepage(){
    const message = this.appService.getHello();
    return{
      message:message
    }
    // return this.appService.getHello();
  }
}
