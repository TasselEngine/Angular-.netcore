import { JsonHelper } from './../../../../utils/helpers/typed_json.helper';
import { serializeAs, deserializeAs } from 'cerialize';
import { IENV, IEnvMain, IEnvServer, IEnvWeibo } from './../../../interfaces/config.contract';

export class AppMainConfig {

    @serializeAs('web_title')
    @deserializeAs('web_title')
    private web_title: string;
    public get Title() { return this.web_title; }

    @serializeAs('owner')
    @deserializeAs('owner')
    private owner: string;
    public get Owner() { return this.owner; }

    @serializeAs('version')
    @deserializeAs('version')
    private version: string | number;
    public get Version() { return this.version; }

    @serializeAs('description')
    @deserializeAs('description')
    private description: string;
    public get Description() { return this.description; }

}

export class AppServerConfig {

    @serializeAs('type')
    @deserializeAs('type')
    private type: string;
    public get ConnectType() { return this.type; }

    @serializeAs('host')
    @deserializeAs('host')
    private host: string | number;
    public get Host() { return this.host; }

    @serializeAs(Number, 'port')
    @deserializeAs(Number, 'port')
    private port: number;
    public get Port() { return this.port; }

    @serializeAs('path')
    @deserializeAs('path')
    private path: string;
    public get Path() { return this.path; }

}

export class AppWeiboConfig {

    @serializeAs('oauth_path')
    @deserializeAs('oauth_path')
    private oauth_path: string;
    public get OAuthPath() { return this.oauth_path; }

    @serializeAs('client_id')
    @deserializeAs('client_id')
    private client_id: string | number;
    public get ClientID() { return this.client_id; }

}

export class AppConfig {

    @serializeAs('main')
    @deserializeAs(AppMainConfig, 'main')
    private main: AppMainConfig;
    public get Main() { return this.main; }

    @serializeAs('server')
    @deserializeAs(AppServerConfig, 'server')
    private server: AppServerConfig;
    public get Server() { return this.server; }

    @serializeAs('weibo_config')
    @deserializeAs(AppWeiboConfig, 'weibo_config')
    private weibo_config: AppWeiboConfig;
    public get Weibo() { return this.weibo_config; }

    public static readonly Parse = (itf: IENV): AppConfig => JsonHelper.FromJson<AppConfig>(itf, AppConfig);

}
