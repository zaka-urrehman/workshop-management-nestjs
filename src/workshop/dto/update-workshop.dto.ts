import { PartialType } from '@nestjs/mapped-types';
import { CreateWorkshopDto } from './create-workshop.dto';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateWorkshopDto extends PartialType(CreateWorkshopDto) {
  @ApiPropertyOptional({ example: 'Updated Workshop Title', description: 'Updated title of the workshop' })
  title?: string;

  @ApiPropertyOptional({ example: 'Updated Description', description: 'Updated description of the workshop' })
  description?: string;

  @ApiPropertyOptional({ example: '456 Updated St, New City, New Country', description: 'Updated physical address' })
  locationAddress?: string;

  @ApiPropertyOptional({ example: 40.7128, description: 'Updated latitude of the workshop location' })
  location_lat?: number;

  @ApiPropertyOptional({ example: -74.0060, description: 'Updated longitude of the workshop location' })
  location_lng?: number;
}
