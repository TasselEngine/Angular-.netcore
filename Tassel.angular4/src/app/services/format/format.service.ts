import { Regex, RegexType } from 'ws-regex';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';
import { FormatTime } from 'ws-format-time';
import { ServerService } from './../server/server.service';
import { IdentityService } from './../identity/identity.service';
import { Logger } from 'ws-logger';
import { Injectable } from '@angular/core';
import { AsyncableServiceBase } from '../base/service.base';
import { ITiebaImage } from '../../model/app.model';

@Injectable()
export class FormatService extends AsyncableServiceBase {

    private logger: Logger<FormatService>;

    private get ImageSrcRoot() { return this.server.ServerApiRoot; }

    constructor(
        private identity: IdentityService,
        private server: ServerService) {
        super();
        this.logger = this.logsrv.GetLogger('FormatService').SetModule('service');
    }

    public readonly ImageConnect = (path: string): string => {
        return this.ImageSrcRoot + path;
    }

    public readonly ImageTickParse = (str: string, coll: ITiebaImage[]): string => {
        const reg = Regex.Create(/\[#\(.+?\)\]/, RegexType.IgnoreCase);
        str = this.goRegex(reg, str, coll);
        return str;
    }

    private goRegex = (reg: Regex, str: string, ticks: ITiebaImage[]): string => {
        const coll = reg.Matches(str);
        if (coll[0] && coll[0] !== '') {
            const target = ticks.find(i => `[${i.key}]` === coll[0]);
            if (target) {
                str = str.replace(coll[0], `<img width="24" src="${this.ImageSrcRoot}${target.value}" />`);
            }
            return this.goRegex(reg, str, ticks);
        } else {
            return str;
        }
    }

    public readonly TimeFormat = (time: FormatTime) => {
        const seconds = Math.floor((Date.now() - time.UnixTime) / 1000);
        if (seconds > 315361000) {
            return time.FormatDateTime;
        } else if (seconds > 25921000) {
            const months = Math.floor(seconds / 2592000);
            return `${months} month${months > 1 ? 's' : ''} ago`;
        } else if (seconds > 604800) {
            const weeks = Math.floor(seconds / 604800);
            return `${weeks} week${weeks > 1 ? 's' : ''} ago`;
        } else if (seconds > 86400) {
            const days = Math.floor(seconds / 86400);
            return `${days} day${days > 1 ? 's' : ''} ago`;
        } else if (seconds > 3600) {
            const hours = Math.floor(seconds / 3600);
            return `${hours} hour${hours > 1 ? 's' : ''} ago`;
        } else if (seconds > 60) {
            let mnts = Math.floor(seconds / 60);
            mnts = mnts < 5 ? 1 : Math.floor(mnts / 5) * 5;
            return `${mnts} minute${mnts > 1 ? 's' : ''} ago`;
        } else {
            return 'just now';
        }
    }

}
