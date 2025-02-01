import { IsString, IsNotEmpty, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateWorkshopDto {
    @ApiProperty({ example: 'NodeJS Workshop', description: 'Title of the workshop' })
    @IsString()
    @IsNotEmpty()
    title: string;

    @ApiProperty({ example: 'Learn NodeJS basics and advanced topics', description: 'Description of the workshop' })
    @IsString()
    @IsNotEmpty()
    description: string;

    @ApiProperty({ example: '123 Main St, City, Country', description: 'Physical address of the workshop' })
    @IsString()
    @IsNotEmpty()
    locationAddress: string;

    @ApiProperty({ example: 40.7128, description: 'Latitude of the workshop location' })
    @IsNumber()
    locationLat: number;

    @ApiProperty({ example: -74.0060, description: 'Longitude of the workshop location' })
    @IsNumber()
    locationLng: number;
}
