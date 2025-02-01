import { Controller, Post, Body, UsePipes, ValidationPipe, HttpException, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { RegisterAdminDto } from './dto/admin-register.dto';
import { AuthService } from './auth.service';
import { UserRole } from '../entities/user.entity';
import { AdminLoginDto } from './dto/admin-login.dto';

@ApiTags('Admin Authentication')
@Controller('auth/admin')
export class AdminAuthController {
    constructor(private readonly authService: AuthService) { }

    @Post('register')
    @ApiOperation({ summary: 'Register a new admin' })
    @ApiResponse({ status: 201, description: 'Admin registered successfully' })
    @ApiResponse({ status: 400, description: 'Registration failed' })
    @UsePipes(ValidationPipe)
    @ApiBody({ type: RegisterAdminDto })
    async register(@Body() registerAdminDto: RegisterAdminDto) {
        try {
            // For admins, we assign the ADMIN role automatically
            const admin = await this.authService.register({
                username: registerAdminDto.username,
                firstName: registerAdminDto.firstName,
                lastName: registerAdminDto.lastName,
                email: registerAdminDto.email,
                password: registerAdminDto.password,
                role: UserRole.ADMIN,
            });
            return {
                message: 'Admin registered successfully',
                adminId: admin.id,
            };
        } catch (error) {
            throw new HttpException('Registration failed', HttpStatus.BAD_REQUEST);
        }
    }



    @Post('login')
    @ApiOperation({ summary: 'Admin login endpoint ' })
    @ApiResponse({ status: 200, description: 'Login successful' })
    @ApiResponse({ status: 401, description: 'Unauthorized: Invalid credentials or insufficient permissions' })
    @UsePipes(ValidationPipe)
    @ApiBody({ type: AdminLoginDto })
    async login(@Body() adminLoginDto: AdminLoginDto) {
        const { email, password } = adminLoginDto;
        try {
            // Call the admin-specific login method on the auth service.
            const result = await this.authService.login(email, password);
            if (result.user.role !== UserRole.ADMIN) {
                throw new HttpException('Invalid credentials or insufficient permissions', HttpStatus.UNAUTHORIZED);
            }
            return result; // Expected to return an object such as { access_token: '...' }
        } catch (error) {
            throw new HttpException('Invalid credentials or insufficient permissions', HttpStatus.UNAUTHORIZED);
        }
    }
}
