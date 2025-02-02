import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { EnrollmentService } from './enrollment.service';
import { EnrollmentController } from './enrollment.controller';
import { Enrollment } from './entities/enrollment.entity';
import { Workshop } from 'src/workshop/entities/workshop.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Enrollment, Workshop])],
    controllers: [EnrollmentController],
    providers: [EnrollmentService],
})
export class EnrollmentModule { }
