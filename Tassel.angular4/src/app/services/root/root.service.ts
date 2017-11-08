import { Injectable, ElementRef } from '@angular/core';
import { AsyncableServiceBase } from '../base/service.base';
import { Subject } from 'rxjs/Subject';

@Injectable()
export class RootService extends AsyncableServiceBase {

    private _lastWidth = 0;

    public readonly ScrollSubject: Subject<any> = new Subject<any>();
    public readonly WidthSubject: Subject<number> = new Subject<number>();

    constructor() {
        super();
    }

    public readonly OnScrollToBottom = (scroll_element: any) => {
        this.ScrollSubject.next(scroll_element);
    }

    public readonly OnWidthChanged = (newValue: number, ignore = true) => {
        if (this._lastWidth === newValue && ignore) {
            return;
        }
        this._lastWidth = newValue;
        this.WidthSubject.next(newValue);
    }

}
