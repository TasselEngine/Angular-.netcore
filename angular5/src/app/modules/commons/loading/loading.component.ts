import { Component, Input } from '@angular/core';

@Component({
    selector: 'tassel-common-loading',
    templateUrl: './loading.html',
    styleUrls: ['./loading.scss']
})
export class CommonLoadingComponent {

    @Input()
    public animaWidth: string;

    @Input()
    public maxWidth: string;

    @Input()
    public marginTop: string;

    @Input()
    public padding: string;

    @Input()
    public content: string;

    @Input()
    public contentSize: string;

    @Input()
    public contentTop: string;

}
