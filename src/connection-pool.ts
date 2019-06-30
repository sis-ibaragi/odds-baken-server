import * as mysql from 'promise-mysql';
import * as settings from './settings';

export class ConnectionPool {
    private pool: mysql.Pool;

    constructor() {
        this.pool = mysql.createPool(settings.DATABASE_URL);
        this.pool.on('connection', (connection: mysql.PoolConnection) => {
            console.log('the pool established a new connection to database.');
        });
        this.pool.on('acquire', (connection: mysql.PoolConnection) => {
            console.log('a connection wass checked out from the pool.');
        });
        this.pool.on('release', (connection: mysql.PoolConnection) => {
            console.log('a connection was returned to the pool.');
        });
        this.pool.on('error', err => {
            console.error('error was occurred.', err.code, err.errno, err.sqlState, err.sql, err.name, err.message);
        });
    }

    public getConnection() {
        return this.pool.getConnection();
    }

    public releaseConnection(conn: mysql.PoolConnection) {
        this.pool.releaseConnection(conn);
    }
}
