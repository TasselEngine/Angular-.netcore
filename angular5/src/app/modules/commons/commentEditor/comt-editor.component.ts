import { Component, Input, Output, EventEmitter, HostBinding, OnInit, OnChanges, SimpleChanges, ViewChild, ElementRef, Renderer2 } from '@angular/core';
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
    styleUrls: [
        'comt-editor.scss'
    ]
})
export class CommentEditorComponent implements OnInit, OnChanges {

    private clientHeight: number;

    @Input('open')
    public openEditor = false;

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

    @ViewChild('self')
    private view: ElementRef;
    public get View() { return this.view && this.view.nativeElement; }

    private _vm: IVM = { Comment: '' };
    public get VM() { return this._vm; }

    constructor(private subject: NzModalSubject, private _render: Renderer2) { }

    ngOnInit(): void {
        if (this.openEditor) {
            this.startAnimas();
        }
    }

    ngOnChanges(changes: SimpleChanges): void {
        for (const propName in changes) {
            if (propName === 'openEditor') {
                const toopen = changes[propName].currentValue as boolean;
                if (toopen) {
                    this.startAnimas();
                } else {
                    this.endAnimas();
                }
            }
        }
    }

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


    private endAnimas() {
        this.openEditor = false;
        this._render.setStyle(this.View, 'margin-bottom', `-${this.View.clientHeight}px`);
        this.clientHeight = this.View.clientHeight;
        setTimeout(() => this.show = false, 350);
    }

    private startAnimas() {
        this.show = true;
        this._render.setStyle(this.View, 'margin-bottom', '8px');
        setTimeout(() => this.openEditor = true, 350);
    }
}
