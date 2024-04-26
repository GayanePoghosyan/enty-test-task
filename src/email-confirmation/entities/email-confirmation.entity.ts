import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn } from 'typeorm';
import { IsBoolean, IsString } from 'class-validator';
import { User } from '../../user/entities/user.entity';
import { ExtendedBaseEntity } from '../..//utils';

@Entity('email_confirmation')
export class EmailConfirmation extends ExtendedBaseEntity {
    
    constructor(emailConfirmation: Partial<EmailConfirmation>) {
        super()
        Object.assign(this, emailConfirmation);
    }
    @PrimaryGeneratedColumn()
    id: number;

    @OneToOne(() => User, {onDelete: 'CASCADE', onUpdate:'CASCADE' } )
    @JoinColumn()
    user: User;

    @Column()
    @IsBoolean()
    confirmed: boolean;

    @Column()
    @IsString()
    token: string;
}
