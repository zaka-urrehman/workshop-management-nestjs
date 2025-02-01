import { sign } from 'jsonwebtoken';
import { ConfigService } from '@nestjs/config';

// Function to generate JWT token
export function generateJwtToken(payload: object, configService: ConfigService): string {
  return sign(payload, configService.get<string>('JWT_SECRET'), {
    expiresIn: configService.get<string>('JWT_EXPIRES_IN') || '1h',
  });
}
