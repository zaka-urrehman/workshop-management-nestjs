import { IsString, IsNotEmpty, IsDateString, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateActivityDto {
    @ApiProperty({ example: 'Introduction to NodeJS', description: 'Title of the activity' })
    @IsString()
    @IsNotEmpty()
    title: string;

    @ApiProperty({ example: 'Introduction to NodeJS fundamentals', description: 'Description of the activity' })
    @IsString()
    @IsNotEmpty()
    description: string;

    @ApiProperty({ example: '2025-02-01T10:00:00.000Z', description: 'Start time of the activity' })
    @IsDateString()
    start_time: Date;

    @ApiProperty({ example: '2025-02-01T12:00:00.000Z', description: 'End time of the activity' })
    @IsDateString()
    end_time: Date;

    @ApiPropertyOptional({ example: 'abc123def', description: 'Google Calendar event ID' })
    @IsOptional()
    @IsString()
    google_calendar_event_id?: string;
}
