import { IRouteStruct } from './route.contract';
import { Router, RouterStateSnapshot, UrlSegment, ActivatedRouteSnapshot } from '@angular/router';

export class RouteStruct implements IRouteStruct {

    private readonly coll: string[];
    public get First(): string { return this.coll[0]; }
    public get Second(): string { return this.coll[1]; }
    public get Third(): string { return this.coll[2]; }
    public get Fourth(): string { return this.coll[3]; }
    public get Fifth(): string { return this.coll[4]; }
    public get Length(): number { return this.coll.length; }

    public static Create = (url_router: string | Router) => {
        return new RouteStruct(url_router);
    }

    constructor(url_router: string | Router) {
        if (url_router instanceof Router) {
            this.coll = this.getRouteLevel(url_router.routerState.snapshot);
        } else {
            let url = url_router;
            if (!url || url.length < 1) { return; }
            url = url.split('?')[0];
            this.coll = url.substring(1).split('/');
        }
        this.coll[0] = '/' + this.coll[0] || '';
    }

    private getRouteLevel(snapshot: RouterStateSnapshot) {
        const arr = this.findFinalRoutePath(snapshot.root);
        return arr.filter(i => i.url.length > 0).map(i => i.url[0].path);
    }

    private findFinalRoutePath(root: ActivatedRouteSnapshot): ActivatedRouteSnapshot[] {
        if (root.children.length > 0) {
            return this.findFinalRoutePath(root.children[0]);
        }
        return root.pathFromRoot;
    }

    public CheckIf = (...routesFlag: string[]): boolean => {
        const succs = [] as boolean[];
        if (routesFlag.length !== this.coll.length) { return false; }
        routesFlag.forEach((a, bindex) => succs.push(a === this.coll[bindex]));
        return !succs.includes(false);
    }

    public CheckInclude = (routesFlag: string[]): boolean => {
        const succs = [] as boolean[];
        routesFlag.forEach((a, bindex) => succs.push(a === this.coll[bindex]));
        return !succs.includes(false);
    }

    public DoIf = (action: Function, routesFlag: string[]): RouteStruct => {
        if (!this.CheckIf(...routesFlag)) { return this; }
        action();
        return this;
    }

    public DoIncludes = (action: Function, routesFlag: string[]): RouteStruct => {
        if (!this.CheckInclude(routesFlag)) { return this; }
        action();
        return this;
    }

    public DoEach = (action: Function, ...routesFlag: string[][]): RouteStruct => {
        for (const routes of routesFlag) {
            if (!this.CheckIf(...routes)) { continue; }
            action();
        }
        return this;
    }

}
