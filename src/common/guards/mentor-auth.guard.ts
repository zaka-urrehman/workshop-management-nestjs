import { Injectable, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class MentorAuthGuard extends AuthGuard('jwt') {
    canActivate(context: ExecutionContext) {
        const request = context.switchToHttp().getRequest();
        const user = request.user;

        // If user is not yet populated by the JWT guard, let the guard handle it.
        if (!user) {
            return super.canActivate(context);
        }

        if (user.role === 'mentor') {
            return super.canActivate(context); // Continue with JWT validation
        } else {
            throw new UnauthorizedException('Only mentors can access this resource');
        }
    }
}
