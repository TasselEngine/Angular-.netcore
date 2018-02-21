import { Logger } from 'ws-logger';
import { Router, ActivatedRoute } from '@angular/router';
import { IdentityService, ServerService, StatusService, ResourcesService } from './../../../services/app.service';
import { Component, HostBinding, OnInit, ViewChild, ElementRef, Renderer2 } from '@angular/core';
import { pageShowAnimation } from '../../../utils/app.utils';
import { TasselNavigationBase } from '../../shared/components/base.component';
import { Status, ServerStatus, UnionUser, UserComment, ICommentCreate, ICommentDelete, ModelType } from '../../../model/app.model';
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

    private model: Status;
    private get status_id(): string { return this.model && this.model.ID; }
    public get VM() { return this.model; }

    private openEdit = false;
    public get IsEdit() { return this.openEdit; }

    private showComments = true;
    public get ShowComments() { return this.showComments; }

    public get ImageSrcRoot() { return this.formater.ImageSrcRoot; }

    public get Formator() { return this.formater; }

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
            const [succeed, code, error, details] = await this.status.GetStatusAsync(params.statusid);
            if (!succeed) {
                this.logger.Error(['Get status details failed', 'Server error'], 'ngOnInit');
                return;
            }
            if (code === ServerStatus.Succeed) {
                this.model = details;
                this.model.Content = this.formater.ImageTickParse(this.model.Content, this.resources.AllStickersGroup, 24);
            } else {
                this.logger.Warn(['Get status details failed', 'See the details : ', error.msg], 'ngOnInit');
                this.navigator.GoToNotFound();
            }
        });
    }

    public readonly OnImageClicked = (img_src: string) => {
        // TO DO
        console.log(img_src);
    }

    public readonly OpenCommentPanel = () => {
        this.openEdit = !this.openEdit;
    }

    public readonly ShowDetails = (showComs = true) => {
        this.showComments = showComs;
    }

    public readonly GoToUserRedirect = (uuid: string) => {
        this.navigator.GoToUserRedirect(uuid, this.router.routerState.snapshot.url);
    }

    public readonly CloseCommentAdd = () => {
        this.openEdit = false;
    }

    public readonly DeleteStatus = async () => {
        const width = window.innerWidth > 400 ? 400 : window.innerWidth - 48;
        const modal = this.toast.WarnModal(undefined, 'Do you really want delete this status? This action can\'t be rollback.', width, true, false, [async () => {
            const [succeed, code, error, _] = await this.status.DeleteStatusAsync(this.status_id);
            if (!succeed) {
                this.toast.ErrorToast('Action Failed', 'Server errors.');
                this.logger.Error(['Delete status failed', 'Server error'], 'DeleteStatus');
                return;
            }
            if (code === ServerStatus.Succeed) {
                this.status.CacheUpdate('delete', this.model);
                this.navigator.GoToStatusIndex();
                this.WaitAndDo(() => {
                    this.toast.SucceesMessage('status removed successfully.');
                }, 100);
            } else {
                this.toast.WarnToast('Action Failed', error.msg);
                this.logger.Warn(['Delete status failed', 'See the details : ', error.msg], 'DeleteStatus');
            }
        }, undefined]);
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
            this.toast.ErrorToast('Action Failed', 'Server errors.');
            this.logger.Error(['Add comment failed', 'Server error'], 'AddComment');
            return;
        }
        if (code === ServerStatus.Succeed) {
            comment.Content = this.formater.ImageTickParse(comment.Content, this.resources.AllStickersGroup, is_reply ? 20 : 24);
            if (is_reply) {
                const com = this.model.Comments.find(i => i.ID === params.com_id);
                if (com) { com.Comments.push(comment); }
            } else {
                this.model.Comments.push(comment);
                this.model.CommentCount += 1;
            }
            this.openEdit = false;
            this.toast.SucceesMessage('reply successfully.');
        } else {
            this.toast.WarnToast('Action Failed', error.msg);
            this.logger.Warn(['Add comment failed', 'See the details : ', error.msg], 'AddComment');
        }
    }

    public readonly DeleteComment = async (vm: UserComment) => {
        if (!vm) { return; }
        console.log(vm);
        const params: ICommentDelete = {
            com_id: vm.ID,
            id: this.status_id,
            is_reply: false,
        };
        let is_reply = false;
        if (vm.ParentType === ModelType.Comment) {
            params.is_reply = is_reply = true;
            params.com_id = vm.ParentID;
            params.reply_id = vm.ID;
        }
        console.log(params);
        const [succeed, code, error, comment] = await this.status.DeleteCommentAsync(this.model.ID, params);
        if (!succeed) {
            this.toast.ErrorToast('Action Failed', 'Server errors.');
            this.logger.Error(['Delete comment failed', 'Server error'], 'DeleteComment');
            return;
        }
        if (code === ServerStatus.Succeed) {
            if (is_reply) {
                const cmt = this.model.Comments.find(i => i.ID === vm.ParentID);
                if (cmt) { cmt.Comments = cmt.Comments.filter(i => i.ID !== vm.ID); }
            } else {
                this.model.Comments = this.model.Comments.filter(i => i.ID !== vm.ID);
                this.model.CommentCount -= 1;
            }
            this.toast.SucceesMessage('comment deleted.');
        } else {
            this.toast.WarnToast('Action Failed', error.msg);
            this.logger.Warn(['Delete comment failed', 'See the details : ', error.msg], 'DeleteComment');
        }
    }

}
