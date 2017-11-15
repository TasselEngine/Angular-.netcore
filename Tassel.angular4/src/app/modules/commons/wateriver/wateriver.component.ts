import { Subscription } from 'rxjs/Subscription';
import { Component, Input, TemplateRef, OnInit, OnDestroy, AfterViewInit } from '@angular/core';
import { RootService, AsyncableServiceBase } from '../../../services/app.service';

// tslint:disable:no-input-rename

@Component({
    selector: 'tassel-common-wateriver',
    templateUrl: './wateriver.html',
    styleUrls: [
        './wateriver.scss',
    ]
})
export class WateriverComponent extends AsyncableServiceBase implements OnInit, OnDestroy, AfterViewInit {

    @Input('data')
    private _posts: any[];
    public get Posts(): any[] { return this._posts; }

    @Input('loader')
    private _loader: () => any[];

    @Input('template')
    public template: TemplateRef<any>;

    private scrollSubp: Subscription;

    constructor(private root: RootService) { super(); }

    ngOnInit(): void {
        this.DoAndWait(async () => {
            this._posts = await this._loader();
        }, 0);
    }

    ngOnDestroy(): void {
        if (this.scrollSubp) {
            this.scrollSubp.unsubscribe();
        }
    }

    ngAfterViewInit(): void {
        this.scrollSubp = this.root.ScrollSubject.subscribe(scroll => {
            this.DoAndWait(async () => {
                this._posts.push(...((await this._loader()) || []));
            }, 500);
        });
    }

}
