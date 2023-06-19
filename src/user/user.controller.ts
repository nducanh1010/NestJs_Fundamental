import { Controller, Delete, Get } from '@nestjs/common';

@Controller('user') // route /user
export class UserController {
    @Get()
    findAll():string{
        return'this action returns all user'
    }
    @Delete("/by-id")
    findById():string{
        return 'this action delete an user by id'
    }
}

