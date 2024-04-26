import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmailConfirmation } from './entities/email-confirmation.entity';
import { EmailConfirmationService } from './email-confirmation.service';
import { MailModule } from '../mail';

@Module({
    imports: [TypeOrmModule.forFeature([EmailConfirmation]), MailModule],
    providers: [EmailConfirmationService],
    controllers: [],
    exports: [EmailConfirmationService]
})
export class EmailConfirmationModule {}
