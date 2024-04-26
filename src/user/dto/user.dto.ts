import { ApiProperty } from '@nestjs/swagger';
import {
    IsBoolean,
    IsEmail,
    IsEnum,
    IsNotEmpty,
    IsNumber,
    IsString
} from 'class-validator';
import { UserRole } from '../../role';

export class UserDto {
    @IsNumber()
    id:number
    
    @ApiProperty({ type: String })
    @IsNotEmpty()
    @IsString()
    firstName: string;

    @ApiProperty({ type: String })
    @IsNotEmpty()
    @IsString()
    lastName: string;

    @ApiProperty({ type: String })
    @IsEmail()
    @IsString()
    email: string;

    @ApiProperty({ type: String })
    @IsNotEmpty()
    @IsString()
    telephone: string;

    @IsBoolean()
    emailConfirmed: boolean;

    @IsEnum(UserRole)
    role: UserRole;
}
