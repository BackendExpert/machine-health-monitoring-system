import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';

interface JwtPayload {
    sub: string;
    user: string;
    role?: string;
    type?: string;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(private configService: ConfigService) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: configService.get<string>('JWT_SECRET'),
        });
    }

    async validate(payload: JwtPayload) {
        if (!payload?.user) throw new UnauthorizedException('JWT missing user email');
        if (payload.type !== 'LOGIN_TOKEN') throw new UnauthorizedException('Invalid token type');

        return {
            userId: payload.sub,
            email: payload.user.toLowerCase(),
            role: payload.role, 
        };
    }
}