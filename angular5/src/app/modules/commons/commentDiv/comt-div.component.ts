import { Component, Input, Output, EventEmitter, OnDestroy } from '@angular/core';
import { UserComment, Creator, ModelType } from '../../../model/app.model';
import { FormatService, ResourcesService, ToastService, IdentityService, RootService } from '../../../services/app.service';
import { CommentEditorComponent } from '../commentEditor/comt-editor.component';
import { Subscription } from 'rxjs/Subscription';
import { TasselComponentBase } from '../../shared/components/base.component';

interface IVM {
    ShowReply: boolean;
    IsFormat: boolean;
}

@Component({
    selector: 'tassel-common-comtdiv',
    templateUrl: 'comt-div.html',
    styleUrls: [
        'comt-div.scss'
    ]
})
export class CommentDivComponent extends TasselComponentBase implements OnDestroy {

    private _vm: IVM = { ShowReply: false, IsFormat: false };
    public get VM() { return this._vm; }

    @Input('comment')
    private comment: UserComment;
    public get Comment() {
        if (this.comment && this.AllResources.length > 0 && !this._vm.IsFormat) {
            this.comment.Normalize(content => this.formator.ImageTickParse(content, this.AllResources, 24));
            this.comment.Comments.forEach(reply => {
                reply.Normalize(content => this.formator.ImageTickParse(content, this.AllResources, 20));
            });
            this._vm.IsFormat = true;
        }
        return this.comment;
    }

    @Output()
    OnCommentAdd = new EventEmitter<any>();

    @Output()
    OnCommentDelete = new EventEmitter<any>();

    @Output()
    OnUserClicked = new EventEmitter<string>();

    public get AllResources() { return this.resources.AllStickersGroup; }

    public get CanAct() { return this.identity.IsLogined; }

    public get IsWideScreen() { return window.innerWidth > 768; }

    private modalSubsc: Subscription;

    constructor(
        private formator: FormatService,
        private identity: IdentityService,
        private root: RootService,
        private resources: ResourcesService) {
        super();
        this.setI18nPrefix('comment');
    }

    ngOnDestroy(): void {
        if (this.modalSubsc && !this.modalSubsc.closed) {
            this.modalSubsc.unsubscribe();
        }
    }

    public ContentClicked(type: 'reply' | 'comment', reply?: any) {
        if (this.IsWideScreen || !this.identity.IsLogined) {
            return;
        }
        if (type === 'comment') {

        } else {

        }
        const config = { items: [{ label: this.translate('Reply'), onClick: () => this.ReplyClicked(reply && reply.Creator) }] };
        if (this.IsCreator(reply || this.comment)) {
            config.items.push({ label: this.translate('Delete'), onClick: () => this.DeleteClicked(reply || null) });
        }
        this.root.ShowBottomPop(config);
    }

    public IsCreator(comment: UserComment) {
        const cmt = comment || this.comment;
        return cmt.Creator.UUID === this.identity.CurrentUUID;
    }

    public GoToUserDetails(event, mentioned?: Creator) {
        event.stopPropagation();
        this.OnUserClicked.emit(mentioned.UUID);
    }

    public DeleteClicked(comment?: UserComment) {
        const width = window.innerWidth > 400 ? 400 : window.innerWidth - 48;
        const modal = this.toast.WarnModal(undefined, this.translate('Do you really want delete this comment? This action can\'t be rollback.'), width, true, false, [() => {
            const comt = comment || this.comment;
            if (comment) {
                comt.ParentType = ModelType.Comment;
                comt.ParentID = this.comment.ID;
            }
            this.OnCommentDelete.emit(comt);
        }, undefined]);
    }

    public ReplyClicked(mentioned?: Creator, reply?: UserComment) {
        const width = window.innerWidth > 800 ? 800 : window.innerWidth - 48;
        const modal = this.toast.ComponentModal(undefined, CommentEditorComponent, {
            openEditor: true,
            mentioned: mentioned || this.comment.Creator,
            transparent: true
        }, width, true, false);
        this.modalSubsc = modal.subscribe((result: any) => {
            if (typeof (result) !== 'string') {
                this.AddComment(result, reply);
                modal.destroy();
            } else if (result === 'onDestroy') {
                this.modalSubsc.unsubscribe();
            }
        });
    }

    public AddComment(vm: any, reply?: UserComment) {
        if (vm.Mentioned) {
            vm.CommentID = this.comment.ID;
            vm.ReplyDetails = reply && reply.ContentCache;
        }
        this.OnCommentAdd.emit(vm);
    }

}
