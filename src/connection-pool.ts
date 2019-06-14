import * as mysql from 'promise-mysql';

export class ConnectionPool {
    private pool: mysql.Pool;

    public async createPool(host: string, user: string, password: string, database: string, limit: number) {
        this.pool = await mysql.createPool({
            host,
            user,
            password,
            database,
            connectionLimit: limit,
        });
    }

    public getConnection() {
        return this.pool.getConnection();
    }

    public releaseConnection(conn: mysql.PoolConnection) {
        this.pool.releaseConnection(conn);
    }
}
