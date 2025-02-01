import { IsString, IsEmail, IsBoolean } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { BaseRegistrationDto } from './base-registation.dto';

export class RegisterUserDto extends BaseRegistrationDto {  

  @ApiProperty({ example: true, description: 'Flag to determine if the user is a mentor' })
  // @IsBoolean()
  isMentor?: boolean;
}
