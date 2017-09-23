import { environment } from './../../../environments/environment';
import { IENV } from '../../../environments/env.contract';
import { AsyncableServiceBase } from '../base/service.base';

export class ServerService extends AsyncableServiceBase {

    private readonly config: IENV;
    private readonly serverRoot: string;

    public get ServerRoot(): string { return this.serverRoot; }
    public get ServerApiRoot(): string { return `${this.serverRoot}/api`; }

    constructor() {
        super();
        this.config = environment;
        if (checkServerConfig(this.config)) {
            this.serverRoot = this.config.serverConfig.serverPath || '';
        } else {
            this.serverRoot = `${this.config.serverConfig.serverHost}:${this.config.serverConfig.serverPort}`;
        }
    }

}

const checkServerConfig = (config: IENV): boolean => {
    return !config.serverConfig.serverHost || !config.serverConfig.serverPort || config.serverConfig.serverHost === '';
};