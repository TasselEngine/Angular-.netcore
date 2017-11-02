import { Http } from '@angular/http';
import { environment } from './../../../environments/environment';
import { Injectable } from '@angular/core';
import { IENV, AppConfig } from '../../model/app.model';
import { YamlHelper } from '../../utils/app.utils';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';

@Injectable()
export class ServerService {

    private config: AppConfig;
    private serverRoot: string;

    public get ServerRoot(): string { return this.serverRoot; }
    public get ServerApiRoot(): string { return `${this.serverRoot}/api`; }

    public get WeiboOAuthHost(): string { return this.config.Weibo.OAuthPath; }
    public get WeiboClientID(): string | number { return this.config.Weibo.ClientID; }

    constructor(private http: Http) { }

    public readonly LoadConfig = async () => {
        const config = await this.http.get('/assets/config/app.yaml').map(j => j.text()).toPromise();
        this.config = AppConfig.Parse(YamlHelper.Parse<IENV>(config));
        if (checkServerConfig(this.config)) {
            this.serverRoot = this.config.Server.Path || '';
        } else {
            this.serverRoot = `${this.config.Server.ConnectType}://${this.config.Server.Host}:${this.config.Server.Port}`;
        }
    }

}

const checkServerConfig = (config: AppConfig): boolean => {
    return !config.Server.Host || !config.Server.Port || config.Server.Host === '';
};
