import { ApiProperty, PickType } from '@nestjs/swagger';
import {
    IsNotEmpty,
    IsString,
    Matches
} from 'class-validator';
import { UserDto } from './user.dto';

export class CreateUserDto 
    extends PickType(UserDto, ['firstName', 'lastName', 'email', 'telephone'] as const)
{
    @ApiProperty({ type: String })
    @Matches(/((?=.*[0-9])(?=.*[A-Za-z]).{6,})/, {
        message:
            'Password must contain minimum 6 characters (upper and/or lower case) and at least 1 digit'
    })
    @IsNotEmpty()
    @IsString()
    password: string;
}
