import { Injectable, UnauthorizedException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Workshop } from './entities/workshop.entity';
import { Activity } from './entities/activity.entity';
import { CreateWorkshopDto } from './dto/create-workshop.dto';
import { CreateActivityDto } from './dto/create-activity.dto';
import { User, UserRole } from '../entities/user.entity';
import { UpdateWorkshopDto } from './dto/update-workshop.dto';

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

    // ========================= CREATE A WORKSHOP =========================
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

    // ========================= UPDATE A WORKSHOP =========================
    async updateWorkshop(id: number, updateWorkshopDto: UpdateWorkshopDto, mentor: JWTPayload): Promise<{ message: string, workshop: Workshop }> {
        // Find the workshop
        const workshop = await this.workshopRepository.findOne({ where: { id } });
        if (!workshop) {
            throw new NotFoundException('Workshop not found');
        }
        // Only the mentor who created the workshop can update it.
        if (workshop.mentor_id !== mentor.userId) {
            throw new UnauthorizedException('You are not authorized to update this workshop.');
        }

        // Merge the updated fields
        const updatedWorkshop = this.workshopRepository.merge(workshop, updateWorkshopDto);
        const savedWorkshop = await this.workshopRepository.save(updatedWorkshop);
        return { message: "Workshop updated successfully", workshop: savedWorkshop };
    }

    // ========================= DELETE A WORKSHOP =========================
    async deleteWorkshop(id: number, mentor: JWTPayload): Promise<{ message: string }> {
        // Find the workshop
        const workshop = await this.workshopRepository.findOne({ where: { id } });
        if (!workshop) {
            throw new NotFoundException('Workshop not found');
        }
        // Only the mentor who created the workshop can delete it.
        if (workshop.mentor_id !== mentor.userId) {
            throw new UnauthorizedException('You are not authorized to delete this workshop.');
        }
        await this.workshopRepository.delete(id);
        return { message: "Workshop deleted successfully" };
    }

    //   ========================= GET ALL WORKSHOPS =========================
    async getAllWorkshops(): Promise<Workshop[]> {
        return await this.workshopRepository.find();
    }

    //   ========================= GET WORKSHOP BY ID =================
    async getWorkshopById(id: number): Promise<Workshop> {
        const workshop = await this.workshopRepository.findOne({ where: { id } });
        if (!workshop) {
            throw new NotFoundException('Workshop not found');
        }
        return workshop;
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
