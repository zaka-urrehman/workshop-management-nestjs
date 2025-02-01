import { Injectable, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Reflector } from '@nestjs/core';

@Injectable()
export class AdminAuthGuard extends AuthGuard('jwt') {
    constructor(private reflector: Reflector) {
        super();
    }

    canActivate(context: ExecutionContext) {
        const request = context.switchToHttp().getRequest();
        const user = request.user;

        if (user && user.role === 'admin') {
            return super.canActivate(context); // Runs the Passport JWT strategy
        } else {
            throw new UnauthorizedException('You do not have permission to access this resource');
        }
    }
}
