import { Subscription } from 'rxjs/Subscription';
import { AsyncableServiceBase } from './../../../services/base/service.base';
import { Component, ViewChild, ElementRef, Input, OnInit, OnDestroy, AfterViewInit, ContentChild, TemplateRef } from '@angular/core';
import { RootService } from '../../../services/app.service';

// tslint:disable:no-input-rename

interface IAdaptor {
    Col: 1 | 2 | 3 | 4;
}

interface IEntry {
    CreateTimeUnix: number;
    [propName: string]: any;
}

@Component({
    selector: 'tassel-common-waterfall',
    templateUrl: './waterfall.html',
    styleUrls: [
        './waterfall.scss',
    ]
})
export class WaterfallComponent extends AsyncableServiceBase implements OnInit, OnDestroy, AfterViewInit {

    @Input('data')
    private _posts: any[];
    public get Posts(): any[] { return this._posts; }

    @Input('loader')
    private _loader: Function;

    @Input('template')
    public template: TemplateRef<any>;

    private _bindings: any[][] = [[], [], [], []];
    public get Bindings(): any[][] { return this._bindings; }

    private _adaptor: IAdaptor = { Col: 4 };
    public get Adaptor() { return this._adaptor; }

    @ViewChild('indexDiv') private indexDiv: ElementRef;
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

    private isend = false;
    public Loaded = false;

    private scrollSubp: Subscription;

    constructor(private root: RootService) { super(); }

    ngOnInit(): void {
        if (!this._posts || this._posts.length === 0) {
            this.WaitAndDo(async () => {
                const coll = await this._loader(0, 50);
                this._posts = [...coll];
                this.Loaded = true;
                this.reselectHeights(4, undefined, true);
            }, 100);
        } else {
            this.Loaded = true;
            this.reselectHeights(4, undefined, true);
        }
    }

    ngOnDestroy(): void {
        this.shouldExistLoop = true;
        if (this.scrollSubp) {
            this.scrollSubp.unsubscribe();
        }
    }

    ngAfterViewInit(): void {
        this.WaitAndDo(this.rebuildView, 50);
        this.scrollSubp = this.root.ScrollSubject.subscribe(scroll => {
            if (this.isend) {
                scroll.invoker();
                return;
            }
            this.DoAndWait(async () => {
                if (!this._posts) {
                    this._posts = [];
                }
                let stamp = 0;
                const oldLast = this._posts[this._posts.length - 1];
                if (this._posts || this._posts.length > 0) {
                    stamp = (oldLast && oldLast.CreateTimeUnix) || 0;
                }
                const newColl = await this._loader(stamp, 50);
                if (newColl && newColl.length === 0) {
                    this.isend = true;
                    this.toast.InfoMessage('No more status.');
                    scroll.invoker();
                    return;
                }
                this.reselectHeights(this._adaptor.Col, newColl);
                this.reselectCheck(this._adaptor.Col);
                scroll.invoker();
            }, 500);
        });
    }

    private rebuildView = async () => {
        if (this.shouldExistLoop) { return; }
        if (this._posts) {
            const root = this.indexDiv.nativeElement;
            this._adaptor.Col = root.clientWidth > 1200 ? 4 : root.clientWidth > 882 ? 3 : root.clientWidth > 690 ? 2 : 1;
            if (this._adaptor.Col !== this._bindings.length) {
                this.reselectHeights(this._adaptor.Col);
            } else if (this._adaptor.Col > 1) {
                this.reselectCheck(this._adaptor.Col);
            }
        }
        setTimeout(this.rebuildView, 250);
    }

    // reselect by height
    private reselectHeights = async (filt: 1 | 2 | 3 | 4, adds?: any[], isinit = false) => {
        this.shouldRecheck = false;
        if (adds) {
            const coll = this._bindings;
            const result = [coll[0] || [], coll[1] || [], coll[2] || [], coll[3] || []];
            for (let i = 0; i < adds.length; i++) { await this.WaitAndDo(() => result[i % filt].push(adds[i]), 50); }
            this._posts.push(...adds);
        } else {
            const result = [[], [], [], []];
            this._bindings = result.slice(0, filt);
            if (isinit) {
                for (let i = 0; i < this._posts.length; i++) { await this.WaitAndDo(() => result[i % filt].push(this._posts[i]), 50); }
            } else {
                this._posts.forEach((a, b) => result[b % filt].push(a));
            }
        }
        this.shouldRecheck = true;
    }

    private reselectCheck = (filt: 1 | 2 | 3 | 4) => {
        if (!this.shouldRecheck) { return; }
        const ntv = this.columns.slice(0, filt).sort((m, n) => m[1] - n[1]);
        const min = ntv[0];
        const max = ntv[ntv.length - 1];
        if (max[1] < 1600) { return; }
        const devalue = (max[1] - min[1]);
        if ((max[1] - min[1]) < 700) { return; }
        let num = Math.floor(devalue / 700);
        num = num > max.length ? max.length - 1 : num;
        const coll = this._bindings;
        const min_index = min[0];
        const max_index = max[0];
        const result = [coll[0] || [], coll[1] || [], coll[2] || [], coll[3] || []];
        result[min_index].push(...result[max_index].splice(result[max_index].length - 1 - num, num));
        this._bindings = result.slice(0, filt);
    }

}
