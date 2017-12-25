import { TasselAdminCompBase } from './../../shared/components/base.component';
import { Component, HostBinding, OnInit, state } from '@angular/core';
import { AdminService, IdentityService, StatusService } from '../../../services/app.service';
import { Router } from '@angular/router';
import { pageShowAnimation, Queue } from '../../../utils/app.utils';
import { ServerStatus, ISticker } from '../../../model/app.model';
import { Regex } from 'ws-regex';
import { Logger } from 'ws-logger';

@Component({
    selector: 'tassel-admin-status',
    templateUrl: './status.html',
    animations: [pageShowAnimation],
    styleUrls: [
        './admin-status.scss'
    ]
})
export class AdminStatusComponent extends TasselAdminCompBase implements OnInit {

    @HostBinding('@routeAnimation') routeAnimation = true;
    @HostBinding('style.display') display = 'block';

    private model: IStatusCreate = {
        Content: '',
        Images: []
    };
    public get VM() { return this.model; }

    private logger: Logger<AdminStatusComponent>;

    constructor(
        private status: StatusService,
        protected admin: AdminService,
        protected identity: IdentityService,
        protected router: Router) {
        super(admin, identity, router);
        this.logger = this.logsrv.GetLogger<AdminStatusComponent>('AdminStatusComponent').SetModule('admin');
    }

    ngOnInit(): void {

    }

    public TiebaImageClicked = (image: ISticker) => {
        this.model.Content += `[${image.key}]`;
    }

    public readonly OnInputKeyUp = () => {
        const coll = Regex.Create(/(\[#\([^\#]+\))$/).Matches(this.model.Content, ['match']);
        if (coll && coll['match'] && coll['match'] !== '') {
            this.model.Content = this.model.Content.substring(0, this.model.Content.length - coll['match'].length);
        }
    }

    public Submit = async () => {
        const [succeed, code, error, status_id] = await this.status.CreateStatusAsync({
            content: this.model.Content,
            user_name: this.identity.CurrentUser.FriendlyName,
            uid: this.identity.CurrentUUID,
            images: this.model.Images.map(i => i.Payload),
        });
        if (!succeed) {
            this.toast.ErrorToast('Upload status failed', 'Server errors.');
            return;
        }
        if (code === ServerStatus.Succeed) {
            this.navigator.GoToStatusIndex();
        } else {
            this.logger.Warn(['Upload status failed', 'see the details', error.msg], 'Submit');
            this.toast.WarnToast('Upload status failed', error.msg);
        }
    }

    public OnUploaded = (images: IImagePayload[]) => {

    }

    public OnTinyMCEChanges = (content: string) => {
        console.log(content);
    }

}
