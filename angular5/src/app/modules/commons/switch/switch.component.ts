import { Component, Input, DoCheck, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
    selector: 'tassel-switch',
    templateUrl: './switch.html',
    styleUrls: ['./switch.scss']
})
export class LabelSwitchComponent implements OnInit, DoCheck {

    @Input('isOn')
    public bind: boolean;
    private previous: boolean;

    @Input()
    public onLabel: string;

    @Input()
    public closeLabel: string;

    @Input()
    public minWidth = 20;
    public get MinWidth() { return this.minWidth + 'px'; }

    @Output()
    OnChanged = new EventEmitter<boolean>();

    ngOnInit(): void {
        this.previous = this.bind || false;
    }

    ngDoCheck(): void {
        if (this.previous !== this.bind) {
            this.previous = this.bind;
            this.OnChanged.emit(this.previous);
        }
    }

}
