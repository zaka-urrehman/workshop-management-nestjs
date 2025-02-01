import { Controller, Post, Body, Param, ParseIntPipe, UseGuards, Req } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { WorkshopService } from './workshop.service';
import { CreateWorkshopDto } from './dto/create-workshop.dto';
import { CreateActivityDto } from './dto/create-activity.dto';
import { Request } from 'express';

// Use the mentor auth guard we created.
import { MentorAuthGuard } from '../common/guards/mentor-auth.guard';

interface RequestWithUser extends Request {
    user: any;
}

@ApiTags('Workshops')
@Controller('workshops')
@UseGuards(MentorAuthGuard)
export class WorkshopController {
    constructor(private readonly workshopsService: WorkshopService) { }

    @Post()
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
