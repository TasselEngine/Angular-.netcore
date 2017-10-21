import { Injectable, ElementRef } from '@angular/core';
import { AsyncableServiceBase } from '../base/service.base';
import { Subject } from 'rxjs/Subject';

@Injectable()
export class RootService extends AsyncableServiceBase {

    public ScrollSubject: Subject<any> = new Subject<any>();

    constructor() {
        super();
    }

    public readonly OnScrollToBottom = (scroll_element: any) => {
        this.ScrollSubject.next(scroll_element);
    }

}
