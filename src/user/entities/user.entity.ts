import { Entity, PrimaryGeneratedColumn, Column} from 'typeorm';
import { IsBoolean, IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { Exclude } from 'class-transformer';
import { ExtendedBaseEntity } from '../../utils';
import { UserRole } from '../../role';

@Entity()
export class User extends ExtendedBaseEntity {
    constructor(user: Partial<User>) {
        super()
        Object.assign(this, user);
    }

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    @IsString()
    @IsNotEmpty()
    firstName: string;

    @Column()
    @IsString()
    @IsNotEmpty()
    lastName: string;

    @Column({ unique: true })
    @IsString()
    @IsNotEmpty()
    email: string;

    @Column()
    @IsString()
    @IsNotEmpty()
    telephone: string;

    @Column()
    @IsString()
    @IsNotEmpty()
    password: string;

    @Column({ default: false })
    @IsBoolean()
    @IsOptional()
    emailConfirmed: boolean;

    @Column({ type: 'enum', enum: UserRole, default: UserRole.USER })
    @IsEnum(UserRole)
    role: UserRole;

}
