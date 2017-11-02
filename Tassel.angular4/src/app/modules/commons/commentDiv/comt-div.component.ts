import { Component, Input } from '@angular/core';
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

    public get TiebaImages() { return this.resources.TiebaImages; }

    constructor(
        public Formator: FormatService,
        private resources: ResourcesService) { }

}
