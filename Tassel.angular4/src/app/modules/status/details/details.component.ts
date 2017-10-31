import { Logger } from 'ws-logger';
import { Router, ActivatedRoute } from '@angular/router';
import { IdentityService, ServerService, StatusService, ResourcesService } from './../../../services/app.service';
import { Component, HostBinding, OnInit, ViewChild, ElementRef, Renderer2 } from '@angular/core';
import { pageShowAnimation } from '../../../utils/app.utils';
import { TasselNavigationBase } from '../../shared/components/base.component';
import { Status, ServerStatus, UnionUser, UserComment } from '../../../model/app.model';
import { ValidationErrors } from '@angular/forms';

interface ITiebaImage {
    key: string;
    value: string;
}

@Component({
    selector: 'tassel-status-details',
    templateUrl: 'details.html',
    animations: [pageShowAnimation],
    styleUrls: [
        'status-details.scss'
    ]
})
export class StatusDetailsComponent extends TasselNavigationBase implements OnInit {

    @HostBinding('@routeAnimation') routeAnimation = true;
    @HostBinding('style.display') display = 'block';

    @ViewChild('replyInput')
    private replyInput: ElementRef;

    private status_id: string;
    private model: Status;
    public get VM() { return this.model; }

    private openEdit = false;
    public get IsEdit() { return this.openEdit; }

    public CommentToUpload = '';

    public get ImageSrcRoot() { return this.server.ServerApiRoot; }

    public get Formator() { return this.formater; }

    public get TiebaImages() { return this.resources.TiebaImages; }

    private logger: Logger<StatusDetailsComponent>;

    constructor(
        private server: ServerService,
        private route: ActivatedRoute,
        private status: StatusService,
        private resources: ResourcesService,
        private _render: Renderer2,
        protected identity: IdentityService,
        protected router: Router) {
        super(identity, router);
        this.logger = this.logsrv.GetLogger('StatusDetailsComponent').SetModule('status');
    }

    ngOnInit(): void {
        this.route.params.subscribe(async params => {
            this.status_id = params.statusid;
            const [succeed, code, error, details] = await this.status.GetStatusAsync(this.status_id);
            if (!succeed) {
                this.logger.Error(['Get status details failed', 'Server error'], 'ngOnInit');
                return;
            }
            if (code === ServerStatus.Succeed) {
                this.model = details;
            } else {
                this.logger.Warn(['Get status details failed', 'See the details : ', error.msg], 'ngOnInit');
                this.navigator.GoToNotFound();
            }
        });
    }

    public readonly OnImageClicked = (img_src: string) => {
        console.log(img_src);
    }

    public readonly OpenCommentPanel = () => {
        this.openEdit = !this.openEdit;
    }

    public readonly TiebaImageClicked = (image: ITiebaImage) => {
        this.CommentToUpload += `[${image.key}]`;
    }

    public readonly AddComment = async () => {
        const [succeed, code, error, comment] = await this.status.AddCommentAsync(this.model.ID, this.identity.CurrentUUID, this.identity.CurrentUser.FriendlyName, this.CommentToUpload);
        if (succeed && code === ServerStatus.Succeed) {
            this.model.Comments.push(comment);
            this.model.CommentCount += 1;
            this.CommentToUpload = '';
            this.openEdit = false;
        }
    }

}
