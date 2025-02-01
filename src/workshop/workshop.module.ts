import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Workshop } from './entities/workshop.entity';
import { Activity } from './entities/activity.entity';
import { WorkshopService } from './workshop.service';
import { WorkshopController } from './workshop.controller';

@Module({
    imports: [TypeOrmModule.forFeature([Workshop, Activity])],
    providers: [WorkshopService],
    controllers: [WorkshopController],
    exports: [WorkshopService],
})
export class WorkshopModule { }
