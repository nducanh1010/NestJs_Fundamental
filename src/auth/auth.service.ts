import {Injectable} from '@nestjs/common';
import {JwtService} from '@nestjs/jwt';
import {UsersService} from 'src/users/users.service';
import {IUser} from "../users/user.interface";

@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private jwtService: JwtService,
    ) {
    }

    // username/  pass là 2 tham số thư viện passport
    async validateUser(username: string, pass: string): Promise<any> {
        const user = await this.usersService.findOneByUserName(username);
        if (user) {
            const isvalid = this.usersService.IsValidPassword(pass, user.password); // gọi đến bcrypt userservice
            if (isvalid === true) {
                return user;
            }
        }
        return null;
    }

    async login(user: IUser) {
        const {_id, name, email, role} = user;
        const payload = {
            sub: "token login",
            iss: "from server",
            _id,
            name,
            email,
            role
        };
        return {
            access_token: this.jwtService.sign(payload),
            _id,
            name,
            email,
            role
        };
    }
}
