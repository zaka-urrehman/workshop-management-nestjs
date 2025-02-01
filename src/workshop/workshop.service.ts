import { Injectable, UnauthorizedException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Workshop } from './entities/workshop.entity';
import { Activity } from './entities/activity.entity';
import { CreateWorkshopDto } from './dto/create-workshop.dto';
import { CreateActivityDto } from './dto/create-activity.dto';
import { User, UserRole } from '../entities/user.entity';

interface JWTPayload {
    userId: number
    username: string
    role: string
    email: string
}

@Injectable()
export class WorkshopService {
    constructor(
        @InjectRepository(Workshop)
        private readonly workshopRepository: Repository<Workshop>,
        @InjectRepository(Activity)
        private readonly activityRepository: Repository<Activity>,
    ) { }

    async createWorkshop(createWorkshopDto: CreateWorkshopDto, mentor: JWTPayload): Promise<{ message: string, workshop: Workshop }> {
        console.log("mentor from service", mentor);
        // Only mentors can create workshops.
        if (mentor.role !== 'mentor') {
            throw new UnauthorizedException('Only mentors can create workshops.');
        }

        const workshop = this.workshopRepository.create({
            ...createWorkshopDto,
            mentor_id: mentor.userId,
        });
        const savedWorkshop = await this.workshopRepository.save(workshop);
        return { message: "Workshop created successfully", workshop: savedWorkshop };
    }

    async createActivity(
        workshopId: number,
        createActivityDto: CreateActivityDto,
        mentor: User,
    ): Promise<Activity> {
        // Verify that the workshop exists.
        const workshop = await this.workshopRepository.findOne({ where: { id: workshopId } });
        if (!workshop) {
            throw new NotFoundException('Workshop not found');
        }

        // Only the mentor who created the workshop can add activities.
        if (workshop.mentor_id !== mentor.id) {
            throw new UnauthorizedException('You are not authorized to add activities to this workshop.');
        }

        const activity = this.activityRepository.create({
            ...createActivityDto,
            workshop_id: workshopId,
        });
        return this.activityRepository.save(activity);
    }
}
