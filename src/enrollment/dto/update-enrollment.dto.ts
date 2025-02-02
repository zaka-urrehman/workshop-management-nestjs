import { IsString, IsOptional } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateEnrollmentDto {
    @ApiPropertyOptional({ example: 'confirmed', description: 'Updated enrollment status (e.g., pending, confirmed)' })
    @IsOptional()
    @IsString()
    status?: string;
}
