import { Component, ViewChild, ElementRef, Input } from '@angular/core';

// tslint:disable:no-input-rename

@Component({

})
export class WaterfallComponent {

    @Input('data')
    private _posts: any[] = [];
    public get Posts(): any[] { return this._posts; }

    private _bindings: any[][] = [[], [], [], []];
    public get Bindings(): any[][] { return this._bindings; }

    @Input('outDiv') private indexDiv: ElementRef;

    @ViewChild('col01') private col01: ElementRef;
    @ViewChild('col02') private col02: ElementRef;
    @ViewChild('col03') private col03: ElementRef;
    @ViewChild('col04') private col04: ElementRef;
    private get column01() { return (this.col01 || { nativeElement: undefined }).nativeElement; }
    private get column02() { return (this.col02 || { nativeElement: undefined }).nativeElement; }
    private get column03() { return (this.col03 || { nativeElement: undefined }).nativeElement; }
    private get column04() { return (this.col04 || { nativeElement: undefined }).nativeElement; }
    private get columns(): [number, number][] {
        return [
            [0, (this.column01 || { clientHeight: 0 }).clientHeight],
            [1, (this.column02 || { clientHeight: 0 }).clientHeight],
            [2, (this.column03 || { clientHeight: 0 }).clientHeight],
            [3, (this.column04 || { clientHeight: 0 }).clientHeight]
        ];
    }

    private shouldRecheck = false;
    private shouldExistLoop = false;

}
