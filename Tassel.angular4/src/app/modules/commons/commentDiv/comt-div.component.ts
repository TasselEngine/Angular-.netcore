import { Component, Input, Output, EventEmitter } from '@angular/core';
import { UserComment } from '../../../model/app.model';
import { FormatService, ResourcesService } from '../../../services/app.service';

interface IVM {
    ShowReply: boolean;
}

@Component({
    selector: 'tassel-common-comtdiv',
    templateUrl: 'comt-div.html',
    styleUrls: [
        'comt-div.scss'
    ]
})
export class CommentDivComponent {

    private _vm: IVM = { ShowReply: false };
    public get VM() { return this._vm; }

    @Input('comment')
    private comment: UserComment;
    public get Comment() { return this.comment; }

    @Output()
    OnCommentAdd = new EventEmitter<any>();

    public get TiebaImages() { return this.resources.TiebaImages; }

    constructor(
        public Formator: FormatService,
        private resources: ResourcesService) { }

    public readonly ReplyClicked = () => {
        this._vm.ShowReply = !this._vm.ShowReply;
    }

    public readonly AddComment = (vm: any) => {
        if (vm.Mentioned) {
            vm.CommentID = this.comment.ID;
        }
        this.OnCommentAdd.emit(vm);
    }

}
