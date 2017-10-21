import { pageShowAnimation } from './../../../utils/animations/page_show.animation';
import { HostBinding, Component } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { Router } from '@angular/router';
import { TasselNavigationBase } from './../../shared/components/base.component';
import { IdentityService } from './../../../services/identity/identity.service';
import { RootService, StatusService } from '../../../services/app.service';
import { ServerStatus } from '../../../model/interfaces/response.interface';

interface IStatus {
    images: { is_file: boolean, base_64: string; thumb: string; };
    state: number;
    details: string;
    cover: string;
    comments: any[];
    comments_count: number;
    liker_users: any[];
    likers_count: number;
    creator: { uuid: string; user_name: string; };
    id: string;
    create_time: string;
    update_time: string;
}

@Component({
    selector: 'tassel-status-index',
    templateUrl: 'index.html',
    animations: [pageShowAnimation],
    styleUrls: [
        'status-index.scss'
    ]
})
export class StatusIndexComponent extends TasselNavigationBase {

    @HostBinding('@routeAnimation') routeAnimation = true;
    @HostBinding('style.display') display = 'block';

    private _posts: IStatus[] = [];
    public get Posts() { return this._posts; }

    constructor(
        private status: StatusService,
        protected identity: IdentityService,
        protected router: Router) { super(identity, router); }

    public postsProvide = async () => {
        const [succeed, status, error, response] = await this.status.GetAllStatusAsync();
        if (succeed && status === ServerStatus.Succeed) {
            return response;
        } else {
            return [];
        }
    }

}

