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

    private is_width = true;
    public get IsWideScreen() { return this.is_width; }

    public get Formator() { return this.formater; }

    public get ImageSrcRoot() { return this.server.ServerApiRoot; }

    private current_route: string;
    private widthSubp: Subscription;

    constructor(
        private root: RootService,
        private status: StatusService,
        private resources: ResourcesService,
        protected identity: IdentityService,
        protected router: Router) { super(identity, router); }

    ngOnInit(): void {
        this.current_route = this.router.routerState.snapshot.url;
        this.WaitAndDo(() => {
            this.root.OnScrollNeedRebuild({ TimeStamp: new Date(), Key: this.current_route });
        }, 1000);
        this.widthSubp = this.root.WidthSubject.subscribe(value => {
            this.is_width = value > 768;
        });
    }

    ngOnDestroy(): void {
        this.root.OnScrollNeedCheck({ TimeStamp: new Date(), Key: this.current_route });
        if (this.widthSubp) {
            this.widthSubp.unsubscribe();
        }
    }

    public readonly PostsProvider = async (stamp = 0, take = 5) => {
        await this.Delay(200);
        return await this.status.GetAndRefreshStatus(stamp, take);
    }

    public IsLiked(model: Status): boolean {
        let index = model.LikeUserIDs.findIndex(i => i === this.identity.CurrentUUID);
        if (index >= 0) { return true; }
        index = model.LikeUsers.findIndex(i => i.Creator.UUID === this.identity.CurrentUUID);
        return index >= 0;
    }

    public async ClickLike(model: Status) {
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

    public ItemClicked(model: Status) {
        this.navigator.GoToStatusDetails(model.ID);
    }

}
