import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersModule } from 'src/users/users.module';
import { LocalStrategy } from './passport/local.strategy';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
@Module({
  imports: [
    UsersModule,
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        // useFactory = SỬ DỤNG ĐỘNG PROVIDERS
        secretOrPrivateKey: configService.get<string>('JWT_SECRET'), // lấy biến môi trường env
        signOptions: {
          expiresIn: configService.get<string>('JWT_EXPIRE'), // nest/ config service để lấy biến môi trường
        },
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [AuthService, LocalStrategy], // nestjs tự động nhận dạng tồn tại LocalStrategy Passport
  exports: [AuthService],
})
export class AuthModule {}
