import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormatService, ResourcesService } from '../../../services/app.service';
import { ITiebaImage } from '../../../model/app.model';
import { Regex } from 'ws-regex';

interface IVM {
    Menthoned?: {
        UID: number;
        UserName: string;
    };
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

    @Output()
    OnCommentAdd = new EventEmitter<any>();

    private _vm: IVM = { Comment: '' };
    public get VM() { return this._vm; }

    public get TiebaImages() { return this.resources.TiebaImages; }

    constructor(
        public Formator: FormatService,
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
        this.OnCommentAdd.emit(this._vm);
    }

}
