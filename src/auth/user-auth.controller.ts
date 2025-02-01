import { Controller, Post, Body, HttpException, HttpStatus, UsePipes, ValidationPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { RegisterUserDto } from './dto/user-register.dto';
import { AuthService } from './auth.service';
import { UserRole } from '../entities/user.entity';

@ApiTags('User Authentication') // Group this controller under 'User Authentication'
@Controller('auth/user')
export class UserAuthController {
    constructor(private readonly authService: AuthService) { }

    @Post('register')
    @ApiOperation({ summary: 'Register a new user' }) // Describe the endpoint
    @ApiResponse({ status: 201, description: 'User registered successfully' })
    @ApiResponse({ status: 400, description: 'Registration failed' })
    @UsePipes(ValidationPipe) // Validate request body
    @ApiBody({ type: RegisterUserDto }) // Describe expected request body
    async register(@Body() registerUserDto: RegisterUserDto) {
        const role = registerUserDto.isMentor ? UserRole.MENTOR : UserRole.LEARNER;

        try {
            const user = await this.authService.register({
                username: registerUserDto.username,
                firstName: registerUserDto.firstName,
                lastName: registerUserDto.lastName,
                email: registerUserDto.email,
                password: registerUserDto.password,
                role,
            });
            return {
                message: 'User registered successfully',
                userId: user.id,
            };
        } catch (error) {

            console.log("Error: ", error);
            throw new HttpException('Registration failed', HttpStatus.BAD_REQUEST);
        }
    }

    @Post('login')
    @ApiOperation({ summary: 'User login' }) // Describe the endpoint
    @ApiResponse({ status: 200, description: 'Login successful' })
    @ApiResponse({ status: 401, description: 'Invalid credentials' })
    @ApiBody({ type: RegisterUserDto }) // Describe expected request body
    async login(@Body() loginDto: RegisterUserDto) {
        const { username, password } = loginDto;
        try {
            const result = await this.authService.login(username, password);
            return result;
        } catch (error) {
            throw new HttpException('Invalid credentials', HttpStatus.UNAUTHORIZED);
        }
    }
}
