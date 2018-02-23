import { Injectable, ElementRef } from '@angular/core';
import { AsyncableServiceBase } from '../base/service.base';
import { Subject } from 'rxjs/Subject';
import { CacheService } from './../cache/cache.service';
import { Router } from '@angular/router';
import { IBottomPopConfig, Image, IPhotoGallaryConfig } from '../../model/app.model';

interface IScrollState {
    TimeStamp: Date;
    Key?: string;
}

@Injectable()
export class RootService extends AsyncableServiceBase {

    private _lastWidth = 0;

    public readonly ScrollSubject: Subject<any> = new Subject<any>();
    public readonly ScrollCheckSubject: Subject<IScrollState> = new Subject<IScrollState>();
    public readonly ScrollRebuildSubject: Subject<IScrollState> = new Subject<IScrollState>();
    public readonly WidthSubject: Subject<number> = new Subject<number>();
    public readonly BottomPopSubject: Subject<IBottomPopConfig> = new Subject<IBottomPopConfig>();
    public readonly PhotoGallarySubject: Subject<IPhotoGallaryConfig> = new Subject<IPhotoGallaryConfig>();
    public readonly RefreshButtonSubject: Subject<[boolean, Function]> = new Subject<[boolean, Function]>();

    constructor(private cache: CacheService) {
        super();
    }

    public ShowBottomPop(config: IBottomPopConfig) {
        this.BottomPopSubject.next(config);
    }

    public OpenPhotoGallary(config: IPhotoGallaryConfig) {
        this.PhotoGallarySubject.next(config);
    }

    public ShowRefreshButton(isShow = true, invoker = () => null) {
        this.RefreshButtonSubject.next([isShow, invoker]);
    }

    public OnScrollToBottom(scroll_element: any) {
        this.ScrollSubject.next(scroll_element);
    }

    public OnScrollNeedCheck(date: IScrollState) {
        this.ScrollCheckSubject.next(date);
    }

    public OnScrollNeedRebuild(date: IScrollState) {
        this.ScrollRebuildSubject.next(date);
    }

    public OnWidthChanged(newValue: number, ignore = true) {
        if (this._lastWidth === newValue && ignore) {
            return;
        }
        this._lastWidth = newValue;
        this.WidthSubject.next(newValue);
    }

    public SetScrollCache(position: number, key?: string, router?: Router): void {
        const url = key || router && router.routerState.snapshot.url;
        this.cache.SetScrollCache(url, position);
    }

    public GetScrollState(key?: string, router?: Router): number {
        const url = key || router && router.routerState.snapshot.url;
        return this.cache.GetScrollCache(url);
    }

}
