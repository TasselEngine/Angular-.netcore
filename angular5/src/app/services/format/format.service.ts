import { Regex, RegexType } from 'ws-regex';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';
import { FormatTime } from 'ws-format-time';
import { ServerService } from './../server/server.service';
import { IdentityService } from './../identity/identity.service';
import { Logger } from 'ws-logger';
import { Injectable } from '@angular/core';
import { AsyncableServiceBase } from '../base/service.base';
import { ISticker } from '../../model/app.model';

@Injectable()
export class FormatService extends AsyncableServiceBase {

    private logger: Logger<FormatService>;

    public get ImageSrcRoot() { return this.server.ServerStaticRoot; }

    constructor(
        private identity: IdentityService,
        private server: ServerService) {
        super();
        this.logger = this.logsrv.GetLogger('FormatService').SetModule('service');
    }

    public readonly ImageConnect = (path: string): string => {
        return this.ImageSrcRoot + path;
    }

    public readonly ImageTickParse = (str: string, coll: ISticker[], size: number = null): string => {
        if (!coll || coll.length === 0) {
            return str;
        }
        const reg = Regex.Create(/\[#\(.+?\)\]/, RegexType.IgnoreCase);
        str = this.goRegex(reg, str, coll, size);
        return str;
    }

    private goRegex = (reg: Regex, str: string, ticks: ISticker[], size: number): string => {
        const coll = reg.Matches(str);
        if (coll[0] && coll[0] !== '') {
            const target = ticks.find(i => `[${i.key}]` === coll[0]);
            if (target) {
                str = str.replace(coll[0], `</span><img ${size ? 'width="' + size + '"' : ''}src="${this.ImageSrcRoot}${target.value}" />&nbsp;<span>`);
            }
            return this.goRegex(reg, str, ticks, size);
        } else {
            return `<span>${str}</span>`;
        }
    }

}
