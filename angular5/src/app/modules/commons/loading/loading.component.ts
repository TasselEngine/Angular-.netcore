import { Component, Input } from '@angular/core';

@Component({
    selector: 'tassel-common-loading',
    templateUrl: './loading.html',
    styleUrls: ['./loading.scss']
})
export class CommonLoadingComponent {

    @Input()
    private animaWidth: string;

    @Input()
    private maxWidth: string;

    @Input()
    private marginTop: string;

    @Input()
    private padding: string;

    @Input()
    private content: string;

    @Input()
    private contentSize: string;

    @Input()
    private contentTop: string;

}
