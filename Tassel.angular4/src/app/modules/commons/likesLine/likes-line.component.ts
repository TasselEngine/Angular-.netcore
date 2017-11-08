import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Creator, LikeRelation } from '../../../model/app.model';
import { IdentityService } from '../../../services/app.service';

@Component({
    selector: 'tassel-common-likersline',
    templateUrl: 'likes-line.html',
    styleUrls: [
        'likes-line.scss'
    ]
})
export class LikersLineComponent {

    @Input('capacity')
    private capacity: number;
    public get Capacity() { return !this.capacity || this.capacity < 1 ? 1 : this.capacity; }

    @Input('users')
    private users: LikeRelation[];
    private usersCache: LikeRelation[];
    public get Users() {
        if (this.users && this.identity.CurrentUUID) { // show me on the top.
            const me_index = this.users.findIndex(i => i.Creator.UUID === this.identity.CurrentUUID);
            if (me_index >= 0) {
                const me = this.users[me_index];
                this.users.splice(me_index, 1);
                this.usersCache = (this.users || []).slice(0, this.Capacity - 1);
                this.usersCache.push(me);
                this.users.push(me);
            }
        }
        return this.usersCache || (this.users || []).slice(0, this.Capacity);
    }

    @Output()
    OnUserClicked = new EventEmitter<string>();

    constructor(private identity: IdentityService) {

    }

}
