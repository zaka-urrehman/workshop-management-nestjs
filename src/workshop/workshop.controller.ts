import { Controller, Post, Body, Param, ParseIntPipe, UseGuards, Req, Put, Patch, Delete, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { Request } from 'express';

import { WorkshopService } from './workshop.service';
import { CreateWorkshopDto } from './dto/create-workshop.dto';
import { CreateActivityDto } from './dto/create-activity.dto';
import { UpdateWorkshopDto } from './dto/update-workshop.dto';
import { UpdateActivityDto } from './dto/update-activity.dto';
// Use the mentor auth guard we created.
import { MentorAuthGuard } from '../common/guards/mentor-auth.guard';

interface RequestWithUser extends Request {
    user: any;
}

@ApiTags('Workshops')
@Controller('workshops')
export class WorkshopController {
    constructor(private readonly workshopsService: WorkshopService) { }
    // ============================== CREATE A WORKSHOP (mentor only) ==============================
    @Post()
    @UseGuards(MentorAuthGuard)
    @ApiOperation({ summary: 'Create a new workshop' })
    @ApiResponse({ status: 201, description: 'Workshop created successfully' })
    @ApiBody({ type: CreateWorkshopDto })
    async createWorkshop(@Body() createWorkshopDto: CreateWorkshopDto, @Req() req: RequestWithUser) {
        console.log("request recieved", req.user);
        // req.user is assumed to be populated by the JWT guard.
        const mentor = req.user as any;
        console.log("mentor", mentor);
        return await this.workshopsService.createWorkshop(createWorkshopDto, mentor);
    }


    // ============================== UPDATE A WORKSHOP (mentor only) ==============================
    @Patch(':id')
    @UseGuards(MentorAuthGuard)
    @ApiOperation({ summary: 'Update a workshop' })
    @ApiResponse({ status: 200, description: 'Workshop updated successfully' })
    @ApiBody({ type: UpdateWorkshopDto })
    async updateWorkshop(
        @Param('id', ParseIntPipe) id: number,
        @Body() updateWorkshopDto: UpdateWorkshopDto,
        @Req() req: RequestWithUser,
    ) {
        const mentor = req.user;
        return await this.workshopsService.updateWorkshop(id, updateWorkshopDto, mentor);
    }


    // ============================== DELETE A WORKSHOP (mentor only) ==============================
    @Delete(':id')
    @UseGuards(MentorAuthGuard)
    @ApiOperation({ summary: 'Delete an existing workshop' })
    @ApiResponse({ status: 200, description: 'Workshop deleted successfully' })
    async deleteWorkshop(
        @Param('id', ParseIntPipe) id: number,
        @Req() req: RequestWithUser
    ) {
        const mentor = req.user as any;
        return await this.workshopsService.deleteWorkshop(id, mentor);
    }

    // ============================== GET ALL WORKSHOPS (public endpoint)==============================
    @Get()
    @ApiOperation({ summary: 'Get all workshops' })
    @ApiResponse({ status: 200, description: 'Retrieved all workshops' })
    async getAllWorkshops() {
        return await this.workshopsService.getAllWorkshops();
    }

    // ============================== GET A WORKSHOP BY ID (public endpoint)==============================
    @Get(':id')
    @ApiOperation({ summary: 'Get a workshop by ID' })
    @ApiResponse({ status: 200, description: 'Retrieved the workshop' })
    async getWorkshopById(@Param('id', ParseIntPipe) id: number) {
        return await this.workshopsService.getWorkshopById(id);
    }

    // ============================== CREATE AN ACTIVITY (mentor only) ==============================
    @Post(':workshopId/activity')
    @UseGuards(MentorAuthGuard)
    @ApiOperation({ summary: 'Create a new activity for a workshop' })
    @ApiResponse({ status: 201, description: 'Activity created successfully' })
    @ApiBody({ type: CreateActivityDto })
    async createActivity(
        @Param('workshopId', ParseIntPipe) workshopId: number,
        @Body() createActivityDto: CreateActivityDto,
        @Req() req: RequestWithUser,
    ) {
        const mentor = req.user;
        return await this.workshopsService.createActivity(workshopId, createActivityDto, mentor);
    }


    // ============================== UPDATE AN ACTIVITY (mentor only) ==============================
    @Patch(':workshopId/activities/:activityId')
    @UseGuards(MentorAuthGuard)
    @ApiOperation({ summary: 'Update an activity in a workshop' })
    @ApiResponse({ status: 200, description: 'Activity updated successfully' })
    @ApiBody({ type: UpdateActivityDto })
    async updateActivity(
        @Param('workshopId', ParseIntPipe) workshopId: number,
        @Param('activityId', ParseIntPipe) activityId: number,
        @Body() updateActivityDto: UpdateActivityDto,
        @Req() req: RequestWithUser
    ) {
        const mentor = req.user as any;
        return await this.workshopsService.updateActivity(workshopId, activityId, updateActivityDto, mentor);
    }


    // ============================== DELETE AN ACTIVITY (mentor only) ==============================
    @Delete(':workshopId/activities/:activityId')
    @UseGuards(MentorAuthGuard)
    @ApiOperation({ summary: 'Delete an activity in a workshop' })
    @ApiResponse({ status: 200, description: 'Activity deleted successfully' })
    async deleteActivity(
        @Param('workshopId', ParseIntPipe) workshopId: number,
        @Param('activityId', ParseIntPipe) activityId: number,
        @Req() req: RequestWithUser
    ) {
        const mentor = req.user as any;
        return await this.workshopsService.deleteActivity(workshopId, activityId, mentor);
    }

    // ============================== GET ALL ACTIVITIES FOR A WORKSHOP (public endpoint)==============================
    @Get(':workshopId/activities')
    @ApiOperation({ summary: 'Get all activities for a workshop' })
    @ApiResponse({ status: 200, description: 'Retrieved all activities for the workshop' })
    async getAllActivities(
        @Param('workshopId', ParseIntPipe) workshopId: number,
    ) {
        return await this.workshopsService.getAllActivities(workshopId);
    }

    // ============================== GET AN ACTIVITY BY ID FOR A WORKSHOP (public endpoint)==============================
    @Get(':workshopId/activities/:activityId')
    @ApiOperation({ summary: 'Get an activity by ID for a workshop' })
    @ApiResponse({ status: 200, description: 'Retrieved the activity' })
    async getActivityById(
        @Param('workshopId', ParseIntPipe) workshopId: number,
        @Param('activityId', ParseIntPipe) activityId: number,
    ) {
        return await this.workshopsService.getActivityById(workshopId, activityId);
    }
}
