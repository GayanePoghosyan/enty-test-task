import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { compareSync } from 'bcryptjs';

import { UserService } from '../user/user.service';
import { User } from '../user/entities/user.entity';

export interface JWTPayload {
    id: number;
    email: string;
}
export interface JWTToken {
    accessToken: string;
}

@Injectable()
export class AuthService {
    constructor(
        private readonly userService: UserService,
        private readonly jwtService: JwtService
    ) { }

    async validateUser(email: string, unencryptedPassword: string) {
        const user = await this.userService.findByEmail(email);
        if (user && compareSync(unencryptedPassword, user.password)) {
            return user
        }

        return null;
    }

    async login(user: Omit<User, 'password'>): Promise<JWTToken> {
        const payload: JWTPayload = { email: user?.email, id: user?.id };
        return { accessToken: this.jwtService.sign(payload) }
    }
}

