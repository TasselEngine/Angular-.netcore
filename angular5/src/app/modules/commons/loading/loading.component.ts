import { Component, Input } from '@angular/core';

@Component({
    selector: 'tassel-common-loading',
    templateUrl: './loading.html',
    styleUrls: [
        './loading.scss',
        './loading2.scss'
    ]
})
export class CommonLoadingComponent {

    @Input()
    public type: 'pure' | 'colorful' = 'pure';

    @Input('borderSize')
    public vh = 15;
    public get outerVH() { return (this.vh + 2) + 'vh'; }
    public get innerVH() { return this.vh + 'vh'; }

    @Input('borderColor')
    public border = '#383838';
    public get borderColor() { return `${this.border} transparent  transparent`; }

    @Input('borderLine')
    public line = 2;
    public get stroke() { return this.line + 'vh'; }

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
    public contentColor: string;

    @Input()
    public contentSize: string;

    @Input()
    public contentTop: string;

}
