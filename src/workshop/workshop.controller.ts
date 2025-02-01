import { Controller, Post, Body, Param, ParseIntPipe, UseGuards, Req, Put, Patch, Delete, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { WorkshopService } from './workshop.service';
import { CreateWorkshopDto } from './dto/create-workshop.dto';
import { CreateActivityDto } from './dto/create-activity.dto';
import { Request } from 'express';

// Use the mentor auth guard we created.
import { MentorAuthGuard } from '../common/guards/mentor-auth.guard';
import { UpdateWorkshopDto } from './dto/update-workshop.dto';

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
    @Post(':workshopId/activities')
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
}
