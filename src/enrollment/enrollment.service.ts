import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Enrollment, EnrollmentStatus } from './entities/enrollment.entity';
import { Repository } from 'typeorm';
import { CreateEnrollmentDto } from './dto/create-enrollment.dto';
import { UpdateEnrollmentDto } from './dto/update-enrollment.dto';
import { User } from '../entities/user.entity';
import { Workshop } from 'src/workshop/entities/workshop.entity';

@Injectable()
export class EnrollmentService {
    constructor(
        @InjectRepository(Enrollment)
        private enrollmentRepository: Repository<Enrollment>,
        @InjectRepository(Workshop)
        private workshopRepository: Repository<Workshop>,
    ) { }

    //  ============= ENROLL ===============
    async enroll(createEnrollmentDto: CreateEnrollmentDto, learner: JWTPayload): Promise<Enrollment> {
        // Verify the workshop exists.
        const workshop = await this.workshopRepository.findOne({ where: { id: createEnrollmentDto.workshopId } });
        if (!workshop) {
            throw new NotFoundException('Workshop not found');
        }

        // Optionally check if learner is already enrolled.
        const existing = await this.enrollmentRepository.findOne({
            where: { workshop: { id: workshop.id }, learner: { id: learner.userId } },
        });
        if (existing) {
            throw new UnauthorizedException('You are already enrolled in this workshop');
        }

        // Create the enrollment using only the learner's id as a partial user object.
        const enrollment = this.enrollmentRepository.create({
            status: EnrollmentStatus.PENDING,
            workshop,
            learner: { id: learner.userId }
        });

        return await this.enrollmentRepository.save(enrollment);
    }

    // ============== UPDATE ENROLLMENT (status) ===============
    async updateEnrollmentStatus(id: number, updateEnrollmentDto: UpdateEnrollmentDto, requester: JWTPayload): Promise<Enrollment> {
        const enrollment = await this.enrollmentRepository.findOne({ where: { id }, relations: ['learner'] });
        if (!enrollment) {
            throw new NotFoundException('Enrollment not found');
        }
        // Allow update only if the requester is the learner who enrolled.
        if (enrollment.learner.id !== requester.userId) {
            throw new UnauthorizedException('You are not authorized to update this enrollment');
        }
        Object.assign(enrollment, updateEnrollmentDto);
        return await this.enrollmentRepository.save(enrollment);
    }

    // =============== CANCEL ENROLLMENT ===============
    async deleteEnrollment(id: number, requester: JWTPayload): Promise<{ message: string }> {
        const enrollment = await this.enrollmentRepository.findOne({ where: { id }, relations: ['learner'] });
        if (!enrollment) {
            throw new NotFoundException('Enrollment not found');
        }
        if (enrollment.learner.id !== requester.userId) {
            throw new UnauthorizedException('You are not authorized to cancel this enrollment');
        }
        await this.enrollmentRepository.delete(id);
        return { message: 'Enrollment canceled successfully' };
    }

    //    =============== GET ENROLLMENTS (for learner) ===============
    async getEnrollmentsForLearner(learner: JWTPayload): Promise<Enrollment[]> {
        return await this.enrollmentRepository.find({ where: { learner: { id: learner.userId } }, relations: ['workshop'], });
    }

    //  ============== GET ENROLLMENTS (for workshop) ===============
    async getEnrollmentsForWorkshop(workshopId: number): Promise<Enrollment[]> {
        return await this.enrollmentRepository.find({ where: { workshop: { id: workshopId } }, relations: ['learner'] });
    }
}
