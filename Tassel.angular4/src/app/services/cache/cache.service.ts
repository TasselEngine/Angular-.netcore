import { AsyncableServiceBase } from './../base/service.base';
import { Injectable } from '@angular/core';


@Injectable()
export class CacheService extends AsyncableServiceBase {

    public get ScrollCache() { return null; }
    private _scroll_cache: { [key: string]: number } = {};

    public SetScrollCache(key: string, position: number): void {
        this._scroll_cache[key] = position;
    }

    public GetScrollCache(key: string): number {
        return this._scroll_cache[key] || 0;
    }

}
