import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormatService, ResourcesService } from '../../../services/app.service';
import { ITiebaImage, Creator } from '../../../model/app.model';
import { NzModalSubject } from 'ng-zorro-antd';
import { Regex } from 'ws-regex';

interface IVM {
    Mentioned?: {
        UID: number | string;
        UserName: string;
    };
    CommentID?: string;
    Comment: string;
}

@Component({
    selector: 'tassel-common-comtedit',
    templateUrl: 'comt-editor.html',
    styleUrls: [
        'comt-editor.scss'
    ]
})
export class CommentEditorComponent {

    @Input('show')
    private show = false;
    public get ShowEdit() { return this.show; }

    @Input('mentioned')
    private mentioned: Creator;
    public get Mentioned() { return this.mentioned; }

    @Input('transparent')
    private transparent: boolean;
    public get IsTransparent() { return this.transparent; }

    @Output()
    OnCommentAdd = new EventEmitter<any>();

    @Output()
    OnCancel = new EventEmitter<any>();

    private _vm: IVM = { Comment: '' };
    public get VM() { return this._vm; }

    public get TiebaImages() { return this.resources.TiebaImages; }

    constructor(
        public Formator: FormatService,
        private subject: NzModalSubject,
        private resources: ResourcesService) { }

    public readonly TiebaImageClicked = (image: ITiebaImage) => {
        this._vm.Comment += `[${image.key}]`;
    }

    public readonly OnInputKeyUp = () => {
        const coll = Regex.Create(/(\[#\([^\#]+\))$/).Matches(this._vm.Comment, ['match']);
        if (coll && coll['match'] && coll['match'] !== '') {
            this._vm.Comment = this._vm.Comment.substring(0, this._vm.Comment.length - coll['match'].length);
        }
    }

    public readonly AddComment = () => {
        if (this.mentioned) {
            this._vm.Mentioned = {
                UID: this.mentioned.UUID,
                UserName: this.mentioned.UserName
            };
        }
        this.OnCommentAdd.emit(this._vm);
        this.subject.next(this._vm);
    }

    public readonly AbortComment = () => {
        this.OnCancel.emit(new Date());
        this.subject.destroy('onCancel');
    }

}
