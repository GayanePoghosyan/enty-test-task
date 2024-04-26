import { BadRequestException, ConflictException, Injectable, InternalServerErrorException, Logger, NotFoundException, UnprocessableEntityException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { hashSync } from 'bcrypt';
import { ConfigService } from '@nestjs/config';
import { InjectRepository, } from '@nestjs/typeorm';
import { validate } from 'class-validator';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { ISuccessResponse, ResponseSuccess } from '../utils';
import { EmailConfirmationService } from '../email-confirmation/email-confirmation.service';
import { UserRole } from '../role';

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);

  constructor(
    @InjectRepository(User)
    private readonly repository: Repository<User>,
    private readonly config: ConfigService,
    private readonly emailConfirmationService: EmailConfirmationService,
  ) { }


 async findByEmail(email: string): Promise<User | null> {
    return await this.repository.findOneBy({ email })
  }

  private hashPassword(password: string) {
    try {
      const saltRounds = this.config.get<number>('SALT_ROUNDS');
      return hashSync(password, saltRounds);
    } catch (error) {
      this.logger.error(error.toString());
      throw error;
    }
  }

  async create(createUserDto: CreateUserDto): Promise<User> {
    try {
      const existingUser = await this.findByEmail(createUserDto.email);

      if (existingUser) {
        throw new ConflictException(`User with this email ${createUserDto.email} already exists`);
      }

      // Check to make sure that the phone number has correct format
      if (!createUserDto.telephone.startsWith('+')) {
        createUserDto.telephone = `+${createUserDto.telephone}`;
      }

      const createEntity = new User({
        firstName: createUserDto.firstName,
        lastName: createUserDto.lastName,
        email: createUserDto.email.toLowerCase().trim(),
        telephone: createUserDto.telephone,
        password: this.hashPassword(createUserDto.password),
        role: UserRole.USER
      });

      const validationErrors = await validate(createEntity, {
        skipUndefinedProperties: false
      });

      if (validationErrors.length > 0) {
        throw new UnprocessableEntityException({
          success: false,
          errors: validationErrors
        });
      }
      const user = await this.repository.save(createEntity);
      this.logger.verbose(`Successfully registered user: ${JSON.stringify(user)}`);
      await this.emailConfirmationService.create(user);
      return user;
    } catch (error) {
      this.logger.error(error.toString());

      if (error instanceof ConflictException ||
        error instanceof UnprocessableEntityException ||
        error instanceof BadRequestException
      ) {
        throw error
      }
      throw new InternalServerErrorException({
        message: 'Unable to register a new user due to an unknown error',
        error
      });
    }
  }

  async findAll(): Promise<User[]> {
    return await this.repository.find();
  }

  async findOne(id: number): Promise<User> {
    try {
      const user = await this.repository.findOneBy({ id });
      if (!user) {
        throw new NotFoundException(`User with the specified Id: ${id} was not found`);
      }

      this.logger.verbose(`Successfully received a user: ${JSON.stringify(user)}`);
      return user;
    } catch (error) {
      this.logger.error(error.toString());
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException({
        message: 'Unable to get a user due to an unknown error',
        error
      });
    }
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    try {
      const { firstName, lastName, email, telephone } = updateUserDto
      const user = await this.repository.findOneBy({ id });

      if (!user) {
        throw new NotFoundException(`User with the specified Id: ${id} was not found`);
      }
      const updateEntity = new User({
        firstName,
        lastName,
        telephone,
        email
      });

      const validationErrors = await validate(updateEntity, {
        skipUndefinedProperties: true
      });

      if (validationErrors.length > 0) {
        throw new UnprocessableEntityException({
          success: false,
          errors: validationErrors
        });
      }

      await this.repository.update(id, updateEntity);
      this.logger.verbose(`Successfully updated user data: ${JSON.stringify(updateEntity)}`);
      return this.repository.findOneBy({ id });

    } catch (error) {
      this.logger.error(error.toString());
      if (error instanceof NotFoundException || error instanceof UnprocessableEntityException) {
        throw error;
      }

      throw new InternalServerErrorException({
        message: 'Unable to update user data due to an unknown error',
        error
      });
    }
  }

  async remove(id: number): Promise<ISuccessResponse> {
    try {
      const user = await this.repository.findOneBy({ id });
      if (!user) {
        throw new NotFoundException(`User with the Id ${id} was not found`);
      }

      await this.repository.delete(user.id);
      this.logger.verbose(`Successfully deleted a user. Id: ${id}`);
      return ResponseSuccess();
    } catch (error) {
      this.logger.error(error.toString());
      if (error instanceof NotFoundException) {
        throw error;
      }

      throw new InternalServerErrorException({
        message: 'Unable to delete a user due to an unknown error'
      });
    }
  }
}
