import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AppService } from './app.service';
import { LearnerModule } from './learner/learner.module';
import { AppController } from './app.controller';
import { AuthModule } from './auth/auth.module';
import { MentorModule } from './mentor/mentor.module';
import { AdminModule } from './admin/admin.module';

@Module({
    imports: [
        TypeOrmModule.forRoot({
            type: 'postgres',
            url: process.env.DATABASE_URL,
            entities: [__dirname + '/**/*.entity{.ts,.js}'],
            synchronize: true,
            ssl: {
                rejectUnauthorized: false,
            },
        }),
        AdminModule,
        MentorModule,
        LearnerModule,
        AuthModule
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule { }
