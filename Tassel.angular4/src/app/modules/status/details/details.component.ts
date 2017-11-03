import { Logger } from 'ws-logger';
import { Router, ActivatedRoute } from '@angular/router';
import { IdentityService, ServerService, StatusService, ResourcesService } from './../../../services/app.service';
import { Component, HostBinding, OnInit, ViewChild, ElementRef, Renderer2 } from '@angular/core';
import { pageShowAnimation } from '../../../utils/app.utils';
import { TasselNavigationBase } from '../../shared/components/base.component';
import { Status, ServerStatus, UnionUser, UserComment, ICommentCreate } from '../../../model/app.model';
import { ValidationErrors } from '@angular/forms';
import { Regex } from 'ws-regex';

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

    private showComments = true;
    public get ShowComments() { return this.showComments; }

    public get ImageSrcRoot() { return this.server.ServerApiRoot; }

    public get Formator() { return this.formater; }

    public get TiebaImages() { return this.resources.TiebaImages; }

    private logger: Logger<StatusDetailsComponent>;

    constructor(
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

    public readonly ShowDetails = (showComs = true) => {
        this.showComments = showComs;
    }

    public readonly AddComment = async (vm: any) => {
        if (!vm) { return; }
        const params: ICommentCreate = {
            uid: this.identity.CurrentUUID,
            user_name: this.identity.CurrentUser.FriendlyName,
            content: vm.Comment,
            is_reply: false,
        };
        let is_reply = false;
        if (vm.Mentioned) {
            params.m_uid = vm.Mentioned.UID;
            params.mend_user = vm.Mentioned.UserName;
            params.com_id = vm.CommentID;
            params.is_reply = is_reply = true;
        }
        const [succeed, code, error, comment] = await this.status.AddCommentAsync(this.model.ID, params);
        if (!succeed) {
            this.logger.Error(['Add comment failed', 'Server error'], 'AddComment');
            return;
        }
        if (code === ServerStatus.Succeed) {
            if (is_reply) {
                const com = this.model.Comments.find(i => i.ID === params.com_id);
                if (com) { com.Comments.push(comment); }
            } else {
                this.model.Comments.push(comment);
                this.model.CommentCount += 1;
            }
            this.openEdit = false;
        } else {
            this.logger.Warn(['Add comment failed', 'See the details : ', error.msg], 'AddComment');
        }
    }

}
