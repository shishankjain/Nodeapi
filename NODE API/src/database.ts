import { Pool } from 'pg';

export const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    password: 'test123',
    database: 'newapi',
    port: 5432
});