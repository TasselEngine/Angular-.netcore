import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IENV, AppConfig } from '../../model/app.model';
import { YamlHelper } from '../../utils/app.utils';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';

@Injectable()
export class ServerService {

    private config: AppConfig;
    public get Config() { return this.config; }

    private serverRoot: string;
    private api_root: string;
    private static_root: string;

    public get ServerRoot(): string { return this.serverRoot; }
    public get ServerApiRoot(): string { return this.api_root; }
    public get ServerStaticRoot(): string { return this.static_root; }

    public get WeiboOAuthHost(): string { return this.config.Weibo.OAuthPath; }
    public get WeiboClientID(): string | number { return this.config.Weibo.ClientID; }

    constructor(private http: HttpClient) { }

    public readonly LoadConfig = async () => {
        const config = await this.http.get('/assets/config/app.yaml', { observe: 'response', responseType: 'text' }).toPromise();
        this.config = AppConfig.Parse(YamlHelper.Parse<IENV>(config.body));
        if (checkServerConfig(this.config)) {
            this.serverRoot = this.config.Server.Path || '';
        } else {
            this.serverRoot = `${this.config.Server.ConnectType}://${this.config.Server.Host}:${this.config.Server.Port}`;
        }
        this.api_root = `${this.serverRoot}/${this.config.Server.ApiPrefix}/v${this.config.Server.Version}`;
        this.static_root = `${this.serverRoot}/${this.config.Server.StaticPrefix}`;
    }

}

function checkServerConfig(config: AppConfig): boolean {
    return !config.Server.Host || !config.Server.Port || config.Server.Host === '';
}
