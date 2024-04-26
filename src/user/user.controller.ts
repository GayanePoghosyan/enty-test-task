import { Controller, Get, Post, Body, Patch, Param, Put, Delete, UseInterceptors, ClassSerializerInterceptor, UsePipes, ValidationPipe, HttpStatus, ParseIntPipe, UseGuards, Request } from '@nestjs/common';
import { ApiBody, ApiResponse, ApiParam, ApiBearerAuth } from '@nestjs/swagger';
import { UpdateUserDto } from './dto/update-user.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';
import { UserService } from './user.service';
import { ISuccessResponse } from '../utils';
import { EmailConfirmationService } from '../email-confirmation/email-confirmation.service';
import { RolesGuard, Roles, UserRole } from '../role';
import { AuthGuard } from '@nestjs/passport';

@Controller('user')
@UseInterceptors(ClassSerializerInterceptor)
@UsePipes(ValidationPipe)
@ApiBearerAuth('access-token')

export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly emailConfirmationService: EmailConfirmationService,
  ) { }

  @Post()
  @ApiResponse({ status: HttpStatus.CREATED, description: 'Register a new user' })
  async create(@Body() createUserDto: CreateUserDto): Promise<User> {
    return await this.userService.create(createUserDto);
  }

  @Get()
  @UseGuards(AuthGuard('jwt'))
  @ApiResponse({ status: HttpStatus.OK, description: 'Get all registered users' })
  async findAll(): Promise<User[]> {
    return await this.userService.findAll();
  }

  @Get(':id')
  @UseGuards(AuthGuard('jwt'))
  @ApiResponse({ status: HttpStatus.OK, description: 'Get user details' })
  async get(
    @Param('id', new ParseIntPipe()) id: number
  ): Promise<User> {
    return await this.userService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UserRole.USER)
  @ApiBody({ type: UpdateUserDto })
  @ApiResponse({ status: HttpStatus.OK, description: 'Update user data' })
  async update(@Param('id', new ParseIntPipe()) id: number, @Body() updateUserDto: UpdateUserDto): Promise<User> {
    return await this.userService.update(id, updateUserDto);
  }

  @Put('confirm-email/:token')
  @ApiResponse({ status: HttpStatus.OK, description: 'Confirm an email confirmation token' })
  @ApiParam({ name: 'token', type: String })
  async confirmToken(
    @Param('token') token: string
  ): Promise<ISuccessResponse> {
    return await this.emailConfirmationService.confirmEmail(token);
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiResponse({status: HttpStatus.OK,  description: 'Delete user data'})
  async remove(@Param('id', new ParseIntPipe()) id: number): Promise<ISuccessResponse> {
    return await this.userService.remove(id);
  }
}





