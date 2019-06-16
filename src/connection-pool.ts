import * as mysql from 'promise-mysql';
import * as settings from './settings';

export class ConnectionPool {
    private pool: mysql.Pool;

    constructor() {
        this.pool = mysql.createPool({
            host: settings.DatabaseSettings.HOST,
            user: settings.DatabaseSettings.USER,
            password: settings.DatabaseSettings.PASSWORD,
            database: settings.DatabaseSettings.DATABASE,
            connectionLimit: settings.DatabaseSettings.CONNECTION_LIMIT,
        });
        this.pool.on('connection', (connection: mysql.PoolConnection) => {
            console.log('mysql.Pool.getConnection was called.');
        });
        this.pool.on('release', (connection: mysql.PoolConnection) => {
            console.log('mysql.Pool.releaseConnection was called.');
        });
        this.pool.on('error', err => {
            console.error(
                'mysql.MysqlError was occurred.',
                err.code,
                err.errno,
                err.sqlState,
                err.sql,
                err.name,
                err.message,
            );
        });
    }

    public getConnection() {
        return this.pool.getConnection();
    }

    public releaseConnection(conn: mysql.PoolConnection) {
        this.pool.releaseConnection(conn);
    }
}
