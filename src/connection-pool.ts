import { Pool, PoolClient } from 'pg';
import * as settings from './settings';

export class ConnectionPool {
    private pool: Pool;

    constructor() {
        this.pool = new Pool({ connectionString: settings.DATABASE_URL, ssl: true });

        this.pool.on('connect', (client: PoolClient) => {
            console.log('the pool establishes a new client connection to the PostgreSQL.');
        });
        this.pool.on('acquire', (client: PoolClient) => {
            console.log('a client is checked out from the pool.');
        });
        this.pool.on('error', (err: Error, client: PoolClient) => {
            console.error('error was occurred.', err.name, err.message, err.stack);
        });
        this.pool.on('remove', (client: PoolClient) => {
            console.log('a client is closed & removed from the pool.');
        });
    }

    public getConnection(): Promise<PoolClient> {
        return this.pool.connect();
    }

    public releaseConnection(client: PoolClient): void {
        client.release();
    }
}
