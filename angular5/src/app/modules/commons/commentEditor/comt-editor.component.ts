import { trigger, style, transition, animate, state, group } from '@angular/animations';
import { Component, Input, Output, EventEmitter, HostBinding } from '@angular/core';
import { FormatService, ResourcesService } from '../../../services/app.service';
import { ISticker, Creator } from '../../../model/app.model';
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
    animations: [
        trigger('flyInOut', [
            state('*', style({ opacity: 0, height: 0 })),
            state('active', style({ opacity: 1, height: '*' })),
            state('inactive', style({ opacity: 0, height: 0 })),
            transition('* => active', [
                group([
                    animate('0.3s ease-in-out', style({ height: '*' })),
                    animate('0.5s 0.3s ease-in', style({ opacity: 1 }))
                ])
            ]),
            transition('active => inactive', [
                animate(300)
            ])
        ])
    ],
    styleUrls: [
        'comt-editor.scss'
    ]
})
export class CommentEditorComponent {

    @HostBinding('@flyInOut') animate = true;

    @Input('anima')
    private anima = true;
    public get AnimaRun() { return this.anima ? 'active' : 'inactive'; }

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

    constructor(private subject: NzModalSubject) { }

    public readonly TiebaImageClicked = (image: ISticker) => {
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
        this._vm.Comment = '';
    }

    public readonly AbortComment = () => {
        this.OnCancel.emit(new Date());
        this.subject.destroy('onCancel');
        this._vm.Comment = '';
    }

}