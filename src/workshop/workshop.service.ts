import { Injectable, UnauthorizedException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Workshop } from './entities/workshop.entity';
import { Activity } from './entities/activity.entity';
import { CreateWorkshopDto } from './dto/create-workshop.dto';
import { CreateActivityDto } from './dto/create-activity.dto';
import { User, UserRole } from '../entities/user.entity';
import { UpdateWorkshopDto } from './dto/update-workshop.dto';
import { UpdateActivityDto } from './dto/update-activity.dto';


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

    //   ========================= CREATE ACTIVITY =================
    async createActivity(
        workshopId: number,
        createActivityDto: CreateActivityDto,
        mentor: JWTPayload,
    ): Promise<Activity> {
        // Verify that the workshop exists.
        const workshop = await this.workshopRepository.findOne({ where: { id: workshopId } });
        if (!workshop) {
            throw new NotFoundException('Workshop not found');
        }

        // Only the mentor who created the workshop can add activities.
        if (workshop.mentor_id !== mentor.userId) {
            throw new UnauthorizedException('You are not authorized to add activities to this workshop.');
        }

        const activity = this.activityRepository.create({
            ...createActivityDto,
            workshop_id: workshopId,
        });
        return this.activityRepository.save(activity);
    }


    // ======================== UPDATE ACTIVITY =================
    async updateActivity(
        workshopId: number,
        activityId: number,
        updateActivityDto: UpdateActivityDto,
        mentor: JWTPayload,
    ): Promise<{ message: string; activity: Activity }> {
        // Verify the workshop exists.
        const workshop = await this.workshopRepository.findOne({ where: { id: workshopId } });
        if (!workshop) {
            throw new NotFoundException('Workshop not found');
        }
        // Ensure the mentor owns the workshop.
        if (workshop.mentor_id !== mentor.userId) {
            throw new UnauthorizedException('You are not authorized to update this activity.');
        }
        // Verify that the activity belongs to the workshop.
        const activity = await this.activityRepository.findOne({ where: { id: activityId, workshop_id: workshopId } });
        if (!activity) {
            throw new NotFoundException('Activity not found');
        }
        const updatedActivity = this.activityRepository.merge(activity, updateActivityDto);
        const savedActivity = await this.activityRepository.save(updatedActivity);
        return { message: 'Activity updated successfully', activity: savedActivity };
    }

    // ======================= DELETE ACTIVITY =================
    async deleteActivity(workshopId: number, activityId: number, mentor: JWTPayload): Promise<{ message: string }> {
        // Verify the workshop exists.
        const workshop = await this.workshopRepository.findOne({ where: { id: workshopId } });
        if (!workshop) {
            throw new NotFoundException('Workshop not found');
        }
        // Ensure the mentor owns the workshop.
        if (workshop.mentor_id !== mentor.userId) {
            throw new UnauthorizedException('You are not authorized to delete this activity.');
        }
        // Verify that the activity belongs to the workshop.
        const activity = await this.activityRepository.findOne({ where: { id: activityId, workshop_id: workshopId } });
        if (!activity) {
            throw new NotFoundException('Activity not found');
        }
        await this.activityRepository.delete(activity.id);
        return { message: 'Activity deleted successfully' };
    }

    // ======================= GET ALL ACTIVITIES =================
    async getAllActivities(workshopId: number): Promise<Activity[]> {
        return await this.activityRepository.find({ where: { workshop_id: workshopId } });
    }

    // ======================= GET ACTIVITY BY ID =================
    async getActivityById(workshopId: number, activityId: number): Promise<Activity> {
        const activity = await this.activityRepository.findOne({ where: { id: activityId, workshop_id: workshopId } });
        if (!activity) {
            throw new NotFoundException('Activity not found');
        }
        return activity;
    }
}
