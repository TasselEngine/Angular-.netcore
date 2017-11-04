import { IError } from 'ws-format-httprequest';
import { Logger } from 'ws-logger';
import { HttpAsyncClientBase } from './../base/service.base';
import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { IdentityService } from './../identity/identity.service';
import { ServerService } from './../server/server.service';
import { IResponse, ISticker, ServerStatus } from '../../model/app.model';
import { StrictResult } from '../../utils/app.utils';

@Injectable()
export class ResourcesService extends HttpAsyncClientBase<IResponse> {

    public get Root() { return this.server.ServerApiRoot; }

    public get Options() { return this.identity.Options; }

    public get FormOptions() { return this.identity.FormOptions; }

    private tieba_images: ISticker[];
    public get TiebaImages() { return this.tieba_images || []; }

    private king_masters: ISticker[];
    public get OthersStickers() { return this.king_masters || []; }

    private sina_pop: ISticker[];
    public get SinaPopStickers() { return this.sina_pop || []; }

    private sina_role: ISticker[];
    public get SinaRoleStickers() { return this.sina_role || []; }

    private all_stickers: ISticker[];
    public get AllStickersGroup() { return this.all_stickers || []; }

    private logger: Logger<ResourcesService>;

    constructor(
        protected http: Http,
        private identity: IdentityService,
        private server: ServerService) {
        super(http);
        this.logger = this.logsrv.GetLogger('ResourcesService').SetModule('service');
        this.initResources();
    }

    private initResources = async () => {
        let [s, c, e, images] = await this.GetTiebaImagesAsync();
        if (s && c === ServerStatus.Succeed) { this.tieba_images = images as ISticker[]; }
        [s, c, e, images] = await this.GetOthersStickersAsync();
        if (s && c === ServerStatus.Succeed) { this.king_masters = images as ISticker[]; }
        [s, c, e, images] = await this.GetSinaPopStickersAsync();
        if (s && c === ServerStatus.Succeed) { this.sina_pop = images as ISticker[]; }
        [s, c, e, images] = await this.GetSinaRoleStickersAsync();
        if (s && c === ServerStatus.Succeed) { this.sina_role = images as ISticker[]; }
        this.all_stickers = [...this.tieba_images, ...this.king_masters, ...this.sina_pop, ...this.sina_role];
    }

    public readonly GetTiebaImagesAsync = async () => {
        const [succeed, error, response] = await this.InvokeAsync(`${this.Root}/static/tieba`, this.Options);
        this.apiLog([succeed, error, response], 'Try to get the middle tieba images group.', 'GetTiebaImagesAsync');
        return succeed ?
            StrictResult.Success(response.status, response.content as ISticker[], response.msg) :
            StrictResult.Failed<ISticker[]>(error);
    }

    public readonly GetOthersStickersAsync = async () => {
        const [succeed, error, response] = await this.InvokeAsync(`${this.Root}/static/others`, this.Options);
        this.apiLog([succeed, error, response], 'Try to get the others stickers group.', 'GetOthersStickersAsync');
        return succeed ?
            StrictResult.Success(response.status, response.content as ISticker[], response.msg) :
            StrictResult.Failed<ISticker[]>(error);
    }

    public readonly GetSinaPopStickersAsync = async () => {
        const [succeed, error, response] = await this.InvokeAsync(`${this.Root}/static/sina_pop`, this.Options);
        this.apiLog([succeed, error, response], 'Try to get the sina-pop stickers group.', 'GetSinaPopStickersAsync');
        return succeed ?
            StrictResult.Success(response.status, response.content as ISticker[], response.msg) :
            StrictResult.Failed<ISticker[]>(error);
    }

    public readonly GetSinaRoleStickersAsync = async () => {
        const [succeed, error, response] = await this.InvokeAsync(`${this.Root}/static/sina_role`, this.Options);
        this.apiLog([succeed, error, response], 'Try to get the sina-role stickers group.', 'GetSinaRoleStickersAsync');
        return succeed ?
            StrictResult.Success(response.status, response.content as ISticker[], response.msg) :
            StrictResult.Failed<ISticker[]>(error);
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
