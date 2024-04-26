import { DataSourceOptions } from 'typeorm';
import ormconfig from './ormconfig';

interface ApplicationConfig {
    TYPEORM: DataSourceOptions;
    SALT_ROUNDS:number;
    BASE_URL:string;
    EMAIL_FROM: string;
    JWT_SECRET:string
}

export default function createConfig(): ApplicationConfig {
    return {
        TYPEORM: ormconfig,
        BASE_URL: process.env.BASE_URL ?? '',
        EMAIL_FROM: process.env.EMAIL_FROM ?? '',
        SALT_ROUNDS: Number(process.env.SALT_ROUNDS) ?? 10,
        JWT_SECRET: process.env.EMAIL_FROM ?? ''
    };
}
