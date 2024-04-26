import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { EmailConfirmationModule } from './email-confirmation/email-confirmation.module';
import createConfig from './configuration/config';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [createConfig],
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => configService.get('TYPEORM'),
    }),
    UserModule, EmailConfirmationModule, AuthModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
