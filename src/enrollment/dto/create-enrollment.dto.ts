import { IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateEnrollmentDto {
    @ApiProperty({ example: 1, description: 'ID of the workshop to enroll in' })
    @IsNumber()
    workshopId: number;
}
