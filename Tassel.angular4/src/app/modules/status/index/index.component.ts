import { ServerService } from './../../../services/server/server.service';
import { pageShowAnimation } from './../../../utils/animations/page_show.animation';
import { HostBinding, Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { Router } from '@angular/router';
import { TasselNavigationBase } from './../../shared/components/base.component';
import { IdentityService } from './../../../services/identity/identity.service';
import { RootService, StatusService, ResourcesService } from '../../../services/app.service';
import { ServerStatus, Status } from '../../../model/app.model';

@Component({
    selector: 'tassel-status-index',
    templateUrl: 'index.html',
    animations: [pageShowAnimation],
    styleUrls: [
        'status-index.scss'
    ]
})
export class StatusIndexComponent extends TasselNavigationBase implements OnInit, OnDestroy {

    @HostBinding('@routeAnimation') routeAnimation = true;
    @HostBinding('style.display') display = 'block';

    private _posts: Status[];
    public get Posts() { return this._posts; }

    private isWidth = true;
    public get IsWideScreen() { return this.isWidth; }

    public get Formator() { return this.formater; }

    public get ImageSrcRoot() { return this.server.ServerApiRoot; }

    private widthSubp: Subscription;

    constructor(
        private root: RootService,
        private status: StatusService,
        private resources: ResourcesService,
        protected identity: IdentityService,
        protected router: Router) { super(identity, router); }

    ngOnInit(): void {
        this.widthSubp = this.root.WidthSubject.subscribe(value => {
            this.isWidth = value > 768;
        });
    }

    ngOnDestroy(): void {
        if (this.widthSubp) {
            this.widthSubp.unsubscribe();
        }
    }

    public readonly postsProvide = async () => {
        const [succeed, status, error, response] = await this.status.GetAllStatusAsync();
        if (succeed && status === ServerStatus.Succeed) {
            response.forEach(sta => {
                sta.Content = removeBasSticker(sta.Content);
                sta.Content = this.formater.ImageTickParse(sta.Content, this.resources.AllStickersGroup, 22);
            });
            return response;
        } else {
            return [];
        }
    }

    public readonly IsLiked = (model: Status): boolean => {
        let index = model.LikeUserIDs.findIndex(i => i === this.identity.CurrentUUID);
        if (index >= 0) { return true; }
        index = model.LikeUsers.findIndex(i => i.Creator.UUID === this.identity.CurrentUUID);
        return index >= 0;
    }

    public readonly ClickLike = async (model: Status) => {
        if (!this.identity.IsLogined) {
            return;
        }
        const [succeed, code, error, result] = await this.status.LikeStatusAsync(model.ID, this.identity.CurrentUUID, this.identity.CurrentUser.FriendlyName);
        if (succeed && code === ServerStatus.Succeed) {
            if (result === 'deleted') {
                model.LikeUserIDs = model.LikeUserIDs.filter(i => i !== this.identity.CurrentUUID);
            } else {
                model.LikeUserIDs.push(result);
            }
            model.LikersCount = model.LikeUserIDs.length;
        }
    }

    public readonly ItemClicked = (model: Status) => {
        this.navigator.GoToStatusDetails(model.ID);
    }

}

function removeBasSticker(value: string): string {
    let val = value.substr(0, 48);
    const last = val.lastIndexOf(']');
    if (last >= 0 && val[last + 1] && val[last + 1] !== '[') {
        val = val.substr(0, last + 1);
    }
    return val;
}

