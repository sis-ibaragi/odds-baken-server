export namespace DatabaseSettings {
    export const HOST: string = 'localhost';
    export const PORT: number = 3306;
    export const USER: string = 'appuser01';
    export const PASSWORD: string = 'p@ssw0rd';
    export const DATABASE: string = 'appdb01';
    export const CONNECTION_LIMIT: number = 10;
}

export const DATABASE_URL: string =
    process.env.JAWSDB_MARIA_URL ||
    `mysql://${DatabaseSettings.USER}:${DatabaseSettings.PASSWORD}` +
        `@${DatabaseSettings.HOST}:${DatabaseSettings.PORT}/${DatabaseSettings.DATABASE}`;
