import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges, DoCheck, OnInit } from '@angular/core';
import { Creator, LikeRelation } from '../../../model/app.model';
import { IdentityService } from '../../../services/app.service';

@Component({
    selector: 'tassel-common-likersline',
    templateUrl: 'likes-line.html',
    styleUrls: [
        'likes-line.scss'
    ]
})
export class LikersLineComponent implements OnInit, DoCheck {

    @Input('capacity')
    private capacity: number;
    public get Capacity() { return !this.capacity || this.capacity < 1 ? 1 : this.capacity; }

    @Input('users')
    private users: LikeRelation[];
    private usersCache: LikeRelation[];
    public get Users() {
        this.parseUsers();
        return this.usersCache || (this.usersCache = (this.users || []).slice(0, this.Capacity));
    }

    @Output()
    OnUserClicked = new EventEmitter<string>();

    private countCache = 0;

    constructor(private identity: IdentityService) {

    }

    ngOnInit(): void {
        this.countCache = (this.users || []).length;
        console.log(this.countCache);
    }

    ngDoCheck(): void {
        if (this.countCache === (this.users || []).length) { return; }
        this.countCache = (this.users || []).length;
        this.usersCache = null;
    }

    private parseUsers() {
        if (this.users && this.identity.CurrentUUID) {
            const me_index = this.users.findIndex(i => i.Creator.UUID === this.identity.CurrentUUID);
            if (me_index >= 0) {
                const me = this.users[me_index];
                this.users.splice(me_index, 1);
                this.usersCache = (this.users || []).slice(0, this.Capacity - 1);
                this.usersCache.push(me);
                this.users.push(me);
            }
        }
    }

    public readonly GoToUserDetails = (user?: Creator) => {
        this.OnUserClicked.emit(user.UUID);
    }

}
