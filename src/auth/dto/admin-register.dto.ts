import { PartialType } from '@nestjs/mapped-types';
import { BaseRegistrationDto } from './base-registation.dto';
import { ApiExtraModels, ApiProperty } from '@nestjs/swagger';

export class RegisterAdminDto extends BaseRegistrationDto {
  // If you need any admin-specific properties, add them here.
  // For now, admins will simply use the base properties.
  // @ApiProperty({ example: 'ADMIN', description: 'Role assigned to the admin (implicitly set)' })
  // readonly role: string = 'ADMIN';
}
