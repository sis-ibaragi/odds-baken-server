export namespace DatabaseSettings {
    export const HOST: string = 'z1ntn1zv0f1qbh8u.cbetxkdyhwsb.us-east-1.rds.amazonaws.com';
    export const PORT: number = 3306;
    export const USER: string = 'yxyinobu5mwa1z62';
    export const PASSWORD: string = 'kffkuci4o0c4h8jq';
    export const DATABASE: string = 'ihq2xbiptmm0mjtp';
    export const CONNECTION_LIMIT: number = 10;
}

export const DATABASE_URL: string =
    process.env.JAWSDB_MARIA_URL ||
    `mysql://${DatabaseSettings.USER}:${DatabaseSettings.PASSWORD}` +
        `@${DatabaseSettings.HOST}:${DatabaseSettings.PORT}/${DatabaseSettings.DATABASE}`;
