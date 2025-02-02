import { Controller, Post, Patch, Delete, Get, Body, Param, ParseIntPipe, Req, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { EnrollmentService } from './enrollment.service';
import { CreateEnrollmentDto } from './dto/create-enrollment.dto';
import { UpdateEnrollmentDto } from './dto/update-enrollment.dto';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { RequestWithUser } from 'src/interfaces/request-with-user.interface';

@ApiTags('Enrollments')
@Controller('enrollments')
@UseGuards(JwtAuthGuard) // Only authenticated learners can enroll/update/cancel.
export class EnrollmentController {
    constructor(private readonly enrollmentService: EnrollmentService) { }

    //  ============================= ENROLL IN WORKSHOP =============================
    @Post()
    @ApiOperation({ summary: 'Enroll in a workshop' })
    @ApiResponse({ status: 201, description: 'Enrollment created successfully' })
    @ApiBody({ type: CreateEnrollmentDto })
    async enroll(@Body() createEnrollmentDto: CreateEnrollmentDto, @Req() req: RequestWithUser) {        
        const learner = req.user as any;
        return await this.enrollmentService.enroll(createEnrollmentDto, learner);
    }


    //  ============================= UPDATE ENROLLMENT STATUS =============================
    @Patch(':id')
    @ApiOperation({ summary: 'Update an enrollment status' })
    @ApiResponse({ status: 200, description: 'Enrollment updated successfully' })
    @ApiBody({ type: UpdateEnrollmentDto })
    async updateEnrollment(@Param('id', ParseIntPipe) id: number, @Body() updateEnrollmentDto: UpdateEnrollmentDto, @Req() req: RequestWithUser) {
        const learner = req.user as any;
        return await this.enrollmentService.updateEnrollmentStatus(id, updateEnrollmentDto, learner);
    }

    //  ============================= CANCEL ENROLLMENT =============================
    @Delete(':id')
    @ApiOperation({ summary: 'Cancel an enrollment' })
    @ApiResponse({ status: 200, description: 'Enrollment canceled successfully' })
    async deleteEnrollment(@Param('id', ParseIntPipe) id: number, @Req() req: RequestWithUser) {
        const learner = req.user as any;
        return await this.enrollmentService.deleteEnrollment(id, learner);
    }

    //  ============================= GET ENROLLMENT FOR CURRENT LEARNER =============================
    @Get('learner')
    @ApiOperation({ summary: 'Get enrollments for the current learner' })
    @ApiResponse({ status: 200, description: 'Enrollments retrieved successfully' })
    async getEnrollmentsForLearner(@Req() req: RequestWithUser) {
        const learner = req.user as any;
        return await this.enrollmentService.getEnrollmentsForLearner(learner);
    }

    //  ============================= GET ENROLLMENT FOR SPECIFIC WORKSHOP =============================
    @Get('workshop/:workshopId')
    @ApiOperation({ summary: 'Get enrollments for a specific workshop' })
    @ApiResponse({ status: 200, description: 'Enrollments retrieved successfully' })
    async getEnrollmentsForWorkshop(@Param('workshopId', ParseIntPipe) workshopId: number) {
        return await this.enrollmentService.getEnrollmentsForWorkshop(workshopId);
    }
}
