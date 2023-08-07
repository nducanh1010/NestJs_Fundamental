import {Module} from '@nestjs/common';
import {AppController} from './app.controller';
import {AppService} from './app.service';
import {MongooseModule} from '@nestjs/mongoose';
import {ConfigModule, ConfigService} from '@nestjs/config';
import {UsersModule} from './users/users.module';
import {AuthModule} from './auth/auth.module';
import {softDeletePlugin} from 'soft-delete-plugin-mongoose';
import {CompaniesModule} from './companies/companies.module';
import {JobsModule} from './jobs/jobs.module';
import {FilesModule} from './files/files.module';
import {ResumesModule} from './resumes/resumes.module';
import {PermissionsModule} from './permissions/permissions.module';
import {RolesModule} from './roles/roles.module';
import {DatabasesModule} from './databases/databases.module';
import {MailModule} from './mail/mail.module';
import {SubscribersModule} from './subscribers/subscribers.module';
import {ScheduleModule} from "@nestjs/schedule";
import {ThrottlerModule} from "@nestjs/throttler";

@Module({
    imports: [
        ThrottlerModule.forRoot({
            ttl: 60,   // giơới hạn 1 phút 10 request
            limit: 10,
        }),
        // MongooseModule.forRoot('mongodb+srv://nducanh1010:sy1pzHlQ5VMWXyJ7@cluster0.xpttnn3.mongodb.net/'),
        MongooseModule.forRootAsync({
            imports: [ConfigModule],
            useFactory: async (configService: ConfigService) => ({
                uri: configService.get<string>('MONGO_URL'), //lấy động url
                connectionFactory: (connection) => {
                    connection.plugin(softDeletePlugin);
                    return connection;
                },
            }),
            inject: [ConfigService],
        }),
        ConfigModule.forRoot({
            isGlobal: true,
        }),
        ScheduleModule.forRoot(),
        UsersModule,
        AuthModule,
        CompaniesModule,
        JobsModule,
        FilesModule,
        ResumesModule,
        PermissionsModule,
        RolesModule,
        DatabasesModule,
        MailModule,
        SubscribersModule,
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {
}
