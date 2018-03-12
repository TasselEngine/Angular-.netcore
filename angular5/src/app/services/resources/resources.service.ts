import { IError } from 'ws-format-httprequest';
import { Logger } from 'ws-logger';
import { HttpAsyncClientBase } from './../base/service.base';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { IdentityService } from './../identity/identity.service';
import { ServerService } from './../server/server.service';
import { IResponse, ISticker, ServerStatus, StickersMap } from '../../model/app.model';
import { StrictResult } from '../../utils/app.utils';

@Injectable()
export class ResourcesService extends HttpAsyncClientBase<IResponse> {

    public get Root() { return this.server.ServerApiRoot; }

    public get Options() { return this.identity.Options; }

    public get FormOptions() { return this.identity.FormOptions; }

    private tieba_images: ISticker[];
    public get TiebaImages() { return StickersMap.Tieba || []; }

    private king_masters: ISticker[];
    public get OthersStickers() { return StickersMap.Others || []; }

    private sina_pop: ISticker[];
    public get SinaPopStickers() { return StickersMap.SinaPop || []; }

    private sina_role: ISticker[];
    public get SinaRoleStickers() { return StickersMap.SinaRole || []; }

    private sru_group: ISticker[];
    public get ArusStickers() { return StickersMap.Aru || []; }

    private all_stickers: ISticker[];
    public get AllStickersGroup() {
        return this.all_stickers || (
            this.all_stickers = [...this.TiebaImages, ...this.OthersStickers, ...this.SinaPopStickers, ...this.SinaRoleStickers, ...this.ArusStickers]);
    }

    private logger: Logger<ResourcesService>;

    constructor(
        protected http: HttpClient,
        private identity: IdentityService,
        private server: ServerService) {
        super(http);
        this.logger = this.logsrv.GetLogger('ResourcesService').SetModule('service');
    }

    private readonly apiLog = (result: [boolean, IError, IResponse], title: string, method: string, descrip?: string) => {
        const [succeed, error, response] = result;
        if (succeed) {
            this.logger.Debug([`[ API ]${title}`, ...(descrip ? [descrip, response] : [response])], method);
        } else {
            this.logger.Error([`[ API ]${title}`, 'Connect To Server Failed.', error], method);
        }
    }

}
