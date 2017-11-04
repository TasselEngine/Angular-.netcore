import { Component, Input } from '@angular/core';
import { Creator, LikeRelation } from '../../../model/app.model';

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
    public get Users() { return (this.users || []).slice(0, this.Capacity); }

}
