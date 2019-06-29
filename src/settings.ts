export namespace DatabaseSettings {
    export const HOST: string = 'ec2-54-204-35-248.compute-1.amazonaws.com';
    export const PORT: number = 5432;
    export const USER: string = 'vuflerhtevcary';
    export const PASSWORD: string = '73c932f18c06e7666b5be2865dfd4a8d717bf819e9d66bf9aa44950ec42c10a9';
    export const DATABASE: string = 'd82trb1ecp1t45';
    export const CONNECTION_LIMIT: number = 10;
}

export const DATABASE_URL =
    process.env.DATABASE_URL ||
    `postgres://${DatabaseSettings.USER}:${DatabaseSettings.PASSWORD}` +
        `@${DatabaseSettings.HOST}:${DatabaseSettings.PORT}` +
        `/${DatabaseSettings.DATABASE}`;
