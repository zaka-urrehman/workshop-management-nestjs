import { Injectable, ConflictException, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config'; // ✅ Import ConfigService
import * as bcrypt from 'bcrypt';
import { User, UserRole } from '../entities/user.entity';
import { generateJwtToken } from 'src/utils/jwt.utils';

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(User)
        private readonly usersRepository: Repository<User>,
        private readonly jwtService: JwtService,
        private readonly configService: ConfigService,  // ✅ Inject ConfigService
    ) { }

    // Register User if does not exist
    async register(userData: { username: string; firstName: string; lastName: string; email: string; password: string; role: UserRole }): Promise<User> {
        const existingUser = await this.usersRepository.findOne({
            where: [{ username: userData.username }, { email: userData.email }],
        });
        if (existingUser) {
            throw new ConflictException('Username or email already exists');
        }

        try {
            const saltRounds = 10;
            const hashedPassword = await bcrypt.hash(userData.password, saltRounds);
            const newUser = this.usersRepository.create({
                ...userData,
                password: hashedPassword,
            });
            const savedUser = await this.usersRepository.save(newUser);
            // @ts-ignore
            delete savedUser.password;

            return savedUser;
        } catch (error) {
            throw new InternalServerErrorException('Registration failed');
        }
    }

    // Login 
    async login(email: string, password: string) {
        const user = await this.usersRepository.findOne({ where: { email } });
        if (!user) {
            throw new UnauthorizedException('Invalid credentials');
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            throw new UnauthorizedException('Invalid credentials');
        }

        // Create the payload for JWT
        const payload = { username: user.username, sub: user.id, role: user.role, email: user.email };
        const token = generateJwtToken(payload, this.configService); // ✅ Now works correctly

        return {
            message: 'Login successful',
            user: {
                email: user.email,
                username: user.username,
                firstName: user.firstName,
                lastName: user.lastName,
                role: user.role,
            },
            access_token: token,  // ✅ Use the generated token
        };
    }
}
