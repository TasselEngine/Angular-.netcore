import { Injectable, ElementRef } from '@angular/core';
import { AsyncableServiceBase } from '../base/service.base';
import { Subject } from 'rxjs/Subject';
import { CacheService } from './../cache/cache.service';
import { Router } from '@angular/router';
import { IBottomPopConfig, Image } from '../../model/app.model';
import { Config as ImageGallaryConfig } from '../../modules/commons/photoGallary/contract';

export { ImageGallaryConfig };

interface IScrollState {
    TimeStamp: Date;
    Key?: string;
    ScrollY?: number;
}

export interface IScrollEvent {
    element: any;
    invoker?(): void;
}

@Injectable()
export class RootService extends AsyncableServiceBase {

    private _lastWidth = 0;

    public readonly ScrollSubject: Subject<IScrollEvent> = new Subject<IScrollEvent>();
    public readonly ScrollCheckSubject: Subject<IScrollState> = new Subject<IScrollState>();
    public readonly ScrollRebuildSubject: Subject<IScrollState> = new Subject<IScrollState>();
    public readonly WidthSubject: Subject<number> = new Subject<number>();
    public readonly BottomPopSubject: Subject<IBottomPopConfig> = new Subject<IBottomPopConfig>();
    public readonly PhotoGallarySubject: Subject<ImageGallaryConfig> = new Subject<ImageGallaryConfig>();
    public readonly RefreshButtonSubject: Subject<[boolean, Function]> = new Subject<[boolean, Function]>();
    public readonly ThemeSubject: Subject<boolean> = new Subject<boolean>();

    constructor(private cache: CacheService) {
        super();
    }

    public ChangeTheme(isLight: boolean) {
        this.ThemeSubject.next(isLight);
    }

    public ShowBottomPop(config: IBottomPopConfig) {
        this.BottomPopSubject.next(config);
    }

    public OpenPhotoGallary(config: ImageGallaryConfig) {
        this.PhotoGallarySubject.next(config);
    }

    public ShowRefreshButton(isShow = true, invoker = () => null) {
        this.RefreshButtonSubject.next([isShow, invoker]);
    }

    public OnScrollToBottom(config: IScrollEvent) {
        this.ScrollSubject.next(config);
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
