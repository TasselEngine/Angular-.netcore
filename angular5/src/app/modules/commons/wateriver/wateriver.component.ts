import { Subscription } from 'rxjs/Subscription';
import { Component, Input, TemplateRef, OnInit, OnDestroy, AfterViewInit } from '@angular/core';
import { RootService, AsyncableServiceBase } from '../../../services/app.service';

// tslint:disable:no-input-rename

interface IEntry {
    CreateTimeUnix: number;
    [propName: string]: any;
}

@Component({
    selector: 'tassel-common-wateriver',
    templateUrl: './wateriver.html',
    styleUrls: [
        './wateriver.scss',
    ]
})
export class WateriverComponent extends AsyncableServiceBase implements OnInit, OnDestroy, AfterViewInit {

    @Input('data')
    private _posts: IEntry[];
    public get Posts(): IEntry[] { return this._posts; }

    @Input('loader')
    private _loader: Function;

    @Input('template')
    public template: TemplateRef<any>;

    private isend = false;

    private scrollSubp: Subscription;

    constructor(private root: RootService) { super(); }

    ngOnInit(): void {
        this.WaitAndDo(async () => {
            if (!this._posts || this._posts.length === 0) {
                const coll = await this._loader(0, 15);
                this._posts = [...coll];
            }
        }, 100);
    }

    ngOnDestroy(): void {
        if (this.scrollSubp) {
            this.scrollSubp.unsubscribe();
        }
    }

    ngAfterViewInit(): void {
        this.scrollSubp = this.root.ScrollSubject.subscribe(scroll => {
            if (this.isend) {
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
                const newColl = await this._loader(stamp, 15);
                if (newColl && newColl.length === 0) {
                    this.isend = true;
                    this.toast.InfoMessage('No more status.');
                    return;
                }
                this._posts.push(...newColl);
            }, 500);
        });
    }

}
