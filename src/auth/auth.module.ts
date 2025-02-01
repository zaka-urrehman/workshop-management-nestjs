import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtStrategy } from './jwt.strategy';
import { AuthService } from './auth.service';
import { User } from '../entities/user.entity'; // Adjust the path as needed
import { UserAuthController } from './user-auth.controller';
import { AdminAuthController } from './admin-auth.controller';
// import { JwtAuthGuard } from '../common/guards/user-auth.guard'; // (Optional)

@Module({
  imports: [
    ConfigModule.forRoot(),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: configService.get<string>('JWT_EXPIRES_IN') || '1h' },
      }),
    }),
    TypeOrmModule.forFeature([User]), // Registers the User repository for dependency injection
  ],
  providers: [JwtStrategy, AuthService],
  controllers: [UserAuthController, AdminAuthController], 
  // exports: [JwtAuthGuard], // Export AuthGuard if needed
})
export class AuthModule {}
