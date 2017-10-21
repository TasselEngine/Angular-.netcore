import { IRouteStruct } from './route.contract';

export class RouteStruct implements IRouteStruct {

    private readonly coll: string[];
    public get First(): string { return this.coll[0]; }
    public get Second(): string { return this.coll[1]; }
    public get Third(): string { return this.coll[2]; }
    public get Fourth(): string { return this.coll[3]; }
    public get Fifth(): string { return this.coll[4]; }
    public get Length(): number { return this.coll.length; }

    public static Create = (url: string) => {
        return new RouteStruct(url);
    }

    constructor(url: string) {
        if (!url || url.length < 1) { return; }
        this.coll = url.substring(1).split('/');
        this.coll[0] = '/' + this.coll[0] || '';
    }

    public CheckIf = (...routesFlag: string[]): boolean => {
        const succs = [] as boolean[];
        routesFlag.forEach((a, b) => succs.push(a === this.coll[b]));
        return !succs.includes(false);
    }

    public DoIf = (action: Function, routesFlag: string[]): RouteStruct => {
        if (!this.CheckIf(...routesFlag)) { return this; }
        action();
        return this;
    }

    public DoEach = (action: Function, ...routesFlag: string[][]): RouteStruct => {
        for (const routes of routesFlag) {
            if (this.CheckIf(...routes)) { action(); }
        }
        return this;
    }

}
