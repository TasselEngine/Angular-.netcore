
export interface IENV {
    production: boolean;
    logLevel: 0 | 1 | 2 | 3 | 4;
    serverConfig: {
        serverHost: string,
        serverPort: number,
        serverPath?: string,
    };
}
