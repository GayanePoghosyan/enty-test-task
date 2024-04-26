import { config as dotenvConfig } from 'dotenv';
import { DataSourceOptions } from 'typeorm';
import { EmailConfirmation } from '../email-confirmation/entities/email-confirmation.entity';
import {User} from '../user/entities/user.entity';

dotenvConfig({ path: '.env' });

const config: DataSourceOptions = {
    type: 'postgres',
    host: process.env.DATABASE_HOST?? 'localhost',
    port: Number(process.env.DATABASE_PORT)?? 5432,
    username: process.env.DATABASE_USERNAME?? 'postgres',
    password: process.env.DATABASE_PASSWORD?? '123123',
    database: process.env.DATABASE_NAME?? 'enty-test',
    entities: [User, EmailConfirmation],
    migrations: ['dist/src/migrations/*.ts'],
    synchronize: true,
}

export default config;