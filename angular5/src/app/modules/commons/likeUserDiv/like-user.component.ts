import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Creator, LikeRelation } from '../../../model/app.model';
import { IdentityService } from '../../../services/app.service';

@Component({
    selector: 'tassel-common-likeuser',
    templateUrl: 'like-user.html',
    styleUrls: [
        'like-user.scss'
    ]
})
export class LikeUserDivComponent {

    @Input()
    private user: LikeRelation;
    public get Creator() { return this.user.Creator; }

    @Output()
    OnUserClicked = new EventEmitter<string>();

    public readonly GoToUserDetails = (mentioned?: Creator) => {
        this.OnUserClicked.emit(this.Creator.UUID);
    }

}
