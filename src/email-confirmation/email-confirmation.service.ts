
import { BadRequestException, ConflictException, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as crypto from 'crypto';
import { Repository } from 'typeorm';
import { EmailConfirmation } from '../email-confirmation/entities/email-confirmation.entity';
import { EmailConfirmationToken, ISuccessResponse, ResponseSuccess } from '../utils';
import { User } from '../user/entities/user.entity';
import { MailService } from '../mail';

@Injectable()
export class EmailConfirmationService {
    private readonly logger = new Logger(EmailConfirmationService.name);
    constructor(
        @InjectRepository(EmailConfirmation)
        private readonly repository: Repository<EmailConfirmation>,
        private readonly mailService: MailService
    ) { }

    async create(user: User): Promise<ISuccessResponse> {
        try {
            const exists = await this.repository.findOne({
                relations: ['user'],
                where: { user: { email: user.email } }
            });

            if (exists) {
                throw new ConflictException({
                    success: false,
                    message: `Email confirmation for user with email ${user.email} already exists`
                });
            }

            const { token } = this.generateEmailToken();
            const emailConfirmation = await this.repository.save({
                user,
                confirmed: false,
                token
            });

            return await this.sendConfirmationEmail(user.email);
        } catch (error) {
            this.logger.error(
                `Error adding email confirmation details. `,
                error?.message,
                'Stack Trace: ',
                error?.stack,
            );
            throw error
        }
    }

    async getByEmail(email: User['email']): Promise<EmailConfirmation> {
        const all = await this.repository.find({ relations: ['user'] });
        return all.find(
            (confirmation) => confirmation.user.email.toLowerCase() === email.toLowerCase()
        );
    }

    async confirmEmail(
        token: EmailConfirmationToken['token']
    ): Promise<ISuccessResponse> {
        try {
            const emailConfirmation = await this.repository.findOne({ where:{token }, relations: ['user'] });

            if (!emailConfirmation) {
                throw new BadRequestException({
                    success: false,
                    message: `Email confirmation doesn't exist`
                });
            }

            if (emailConfirmation.confirmed === true) {
                throw new BadRequestException({
                    success: false,
                    message: `Email already confirmed`
                });
            }

            await this.repository.update(emailConfirmation.id, {
                confirmed: true
            });
            const user = emailConfirmation.user;
            user.emailConfirmed = true;
            await user.save();
            
            return ResponseSuccess();
        } catch (error) {
            this.logger.error(
                `Error during email confirmation. `,
                error?.message,
                'Stack Trace: ',
                error?.stack,
            );
            throw error
        }

    }

    async sendConfirmationEmail(email: User['email']): Promise<ISuccessResponse> {
        try {
            const currentToken = await this.getByEmail(email);
            const { id, confirmed } = currentToken;

            if (confirmed) {
                throw new BadRequestException({
                    success: false,
                    message: `Email already confirmed`
                });
            }

            const newToken = this.generateEmailToken();
            await this.repository.update(id, newToken);

            await this.mailService.sendConfirmationEmail(email, newToken)
            return ResponseSuccess();
        } catch (error) {
            this.logger.error(
                `Error sending confirmation email. `,
                error?.message,
                'Stack Trace: ',
                error?.stack,
            );
            throw error
        }
    }

    generateEmailToken(): EmailConfirmationToken {
        return {
            token: crypto.randomBytes(64).toString('hex')
        };
    }
}
