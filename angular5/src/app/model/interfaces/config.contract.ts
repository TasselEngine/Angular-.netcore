
export interface IENV {
    main: IEnvMain;
    server: IEnvServer;
    weibo_config: IEnvWeibo;
}

export interface IEnvMain {
    web_title: string;
    owner: string;
    version: string | number;
    description: string;
}

export interface IEnvServer {
    version: number;
    type: string;
    api_prefix: string;
    static_prefix: string;
    host?: string | number;
    port?: number;
    path?: string;
}

export interface IEnvWeibo {
    oauth_path: string;
    client_id: string | number;
}
