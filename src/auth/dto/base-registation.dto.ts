import { IsString, IsEmail } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class BaseRegistrationDto {
    @ApiProperty({ example: 'john_doe', description: 'Unique username' })
    @IsString()
    username: string;

    @ApiProperty({ example: 'John', description: 'First name' })
    @IsString()
    firstName: string;

    @ApiProperty({ example: 'Doe', description: 'Last name' })
    @IsString()
    lastName: string;

    @ApiProperty({ example: 'john@example.com', description: 'Email address' })
    @IsEmail()
    email: string;

    @ApiProperty({ example: 'securePassword123', description: 'Password' })
    @IsString()
    password: string;
}
