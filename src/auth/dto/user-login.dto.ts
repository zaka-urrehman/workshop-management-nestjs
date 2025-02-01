import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class UserLoginDto {
  @ApiProperty({ example: 'john@gmail.com', description: 'email' })
  @IsString()
  email: string;
  
  @ApiProperty({ example: 'securePassword123', description: 'Password' })
  @IsString()
  password: string;
}
