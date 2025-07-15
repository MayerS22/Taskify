import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UsersService } from '../users/users.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private usersService: UsersService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: 'supersecretkey', // In production, use process.env.JWT_SECRET
    });
  }

  async validate(payload: any) {
    const user = await this.usersService.findByEmail(payload.email);
    console.log('JWT Strategy fetched user:', user); // Debug log
    if (!user) return null;
    const { password, ...userData } = user;
    return userData;
  }
} 