import { PartialType } from '@nestjs/mapped-types';
import { CreateActivityDto } from './create-activity.dto';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateActivityDto extends PartialType(CreateActivityDto) {
    @ApiPropertyOptional({ example: 'Updated Activity Title', description: 'Updated title of the activity' })
    title?: string;

    @ApiPropertyOptional({ example: 'Updated description', description: 'Updated description of the activity' })
    description?: string;

    @ApiPropertyOptional({ example: '2025-02-01T11:00:00Z', description: 'Updated start time in ISO format' })
    start_time?: Date;

    @ApiPropertyOptional({ example: '2025-02-01T13:00:00Z', description: 'Updated end time in ISO format' })
    end_time?: Date;

    @ApiPropertyOptional({ example: 'newGCalEvent123', description: 'Updated Google Calendar event ID' })
    google_calendar_event_id?: string;
}
