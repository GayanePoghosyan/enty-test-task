import { Controller, HttpStatus, Post, Request, UseGuards} from '@nestjs/common'
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './auth.guard';
import { ApiBody, ApiResponse } from '@nestjs/swagger';
import { LoginDataDTO } from './dto/login.dto';
import { User } from '../user/entities/user.entity';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @ApiBody({ type: LoginDataDTO })
  @UseGuards(LocalAuthGuard)
  @ApiResponse({ status: HttpStatus.OK,  description: 'Log in' })
  async login(@Request() req:any) {
    const user = req.user as Omit<User, 'password'>;
    return this.authService.login(user);
  }
}