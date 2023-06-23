import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersModule } from 'src/users/users.module';
import { LocalStrategy } from './passport/local.strategy';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtStrategy } from './passport/jwt.strategy';
import ms from 'ms';
@Module({
  imports: [
    UsersModule,
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        // useFactory = SỬ DỤNG ĐỘNG PROVIDERS
        secret: configService.get<string>('JWT_ACCESS_TOKEN'), // lấy biến môi trường env
        signOptions: {
          expiresIn: ms(configService.get<string>('JWT_ACCESS_EXPIRE')), // nest/ config service để lấy biến môi trường
        },
      }),
      inject: [ConfigService],
    }),
  ],
  // mỗi 1 lần truy cập endpont nào bảo vệ, sẽ gọi jwt
  providers: [AuthService, LocalStrategy, JwtStrategy], // nestjs tự động nhận dạng tồn tại LocalStrategy Passport

  exports: [AuthService],
})
export class AuthModule {}
