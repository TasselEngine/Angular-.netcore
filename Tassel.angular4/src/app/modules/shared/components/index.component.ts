import { Router } from '@angular/router';
import { TasselNavigationBase } from './base.component';
import { IdentityService } from './../../../services/identity/identity.service';
import { pageShowAnimation } from './../../../utils/app.utils';
import { Component, HostBinding, OnInit, ViewChild, ElementRef, AfterViewInit, OnDestroy } from '@angular/core';

interface IPost {
    Cover?: string;
    Title: string;
    Summary?: string;
    Like: number;
    Stamp?: string;
}

interface IAdaptor {
    Col: 1 | 2 | 3 | 4;
}

@Component({
    selector: 'tassel-root-index',
    templateUrl: './../views/index.html',
    animations: [pageShowAnimation],
    styleUrls: [
        './../styles/root.css',
        './../styles/index.css',
        './../styles/card.css'
    ]
})
export class IndexComponent extends TasselNavigationBase implements OnInit, OnDestroy, AfterViewInit {

    @HostBinding('@routeAnimation') routeAnimation = true;
    @HostBinding('style.display') display = 'block';

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

    private _posts: IPost[] = [];
    public get Posts() { return this._posts; }

    private _bindings: IPost[][] = [[], [], [], []];
    public get Bindings() { return this._bindings; }

    private _adaptor: IAdaptor = { Col: 4 };
    public get Adaptor() { return this._adaptor; }

    constructor(
        protected identity: IdentityService,
        protected router: Router) { super(identity, router); }

    ngOnInit(): void {
        this._posts = this.postsProvide();
        this.reselectHeights(4, undefined, true);
    }

    ngOnDestroy(): void {
        this.shouldExistLoop = true;
    }

    private postsProvide = () => {
        return [
            { Cover: 'https://tse1-mm.cn.bing.net/th?id=OIP.C-XsFDZ4CpgjHkNFkqXQDAEsC7&p=0&pid=1.1', Title: '我是一只猫', Summary: '中文测试', Like: 254 },
            { Cover: 'http://p3.wmpic.me/article/2016/07/25/1469459240_PzFfSySK.jpg', Title: 'Europe Street beat', Like: 21, Stamp: 'XXXX-XX-XX' },
            { Title: '什么图片都没有', Summary: '别做梦了。', Like: 213, Stamp: 'XXXX-XX-XX' },
            { Cover: 'https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png', Title: 'Europe Street beat', Summary: 'www.instagram.com', Like: 86 },
            { Cover: 'http://i5.qhimg.com/t019c2a1cad4940cf50.jpg', Title: 'Europe Street beat', Summary: 'www.instagram.com', Like: 123 },
            { Cover: 'http://a0.att.hudong.com/70/82/01300000185479121382825220187.jpg', Title: 'Europe Street beat', Summary: 'www.instagram.com', Like: 34 },
            { Cover: 'http://free-photos-ls02.gatag.net/images/lgf01a201401230500.jpg', Title: 'Europe Street beat', Like: 23, Stamp: 'XXXX-XX-XX' },
            { Cover: 'http://pic.bizhi360.com/bpic/46/5046.jpg', Title: 'Europe Street beat', Summary: 'www.instagram.com', Like: 34, Stamp: 'XXXX-XX-XX' },
            { Cover: 'http://a4.att.hudong.com/03/27/01300000066957120529279410702.jpg', Title: 'Europe Street beat', Summary: 'www.instagram.com', Like: 341 },
            { Title: 'No Picture Test', Summary: 'Sorry, there is no picture for showing, if you want see more , close the browser and get out of home.', Like: 456 },
            { Cover: 'http://pic.7y7.com/Uploads/Former/20148/2014083037415845_0_0_water.jpg', Title: 'Something Wrong', Summary: '......', Like: 34524 },
            { Cover: 'http://uploadfile.deskcity.org/2015/0907/20150907025557427.jpg', Title: 'Europe Street beat', Summary: 'www.instagram.com', Like: 3 },
        ];
    }

    ngAfterViewInit(): void {
        this.WaitAndDo(this.rebuildView, 50);
        this.prepareScroll();
    }

    private prepareScroll = () => {
        const root = this.indexDiv.nativeElement as HTMLDivElement;
        const f_parent = root.parentElement.parentElement.parentElement;
        const that = this;
        const onScroll = function () {
            const add_height = this.scrollTop + this.clientHeight;
            if (this.scrollHeight - add_height < 100) {
                f_parent.onscroll = null;
                setTimeout(() => {
                    that.reselectHeights(that._adaptor.Col, that.postsProvide());
                    that.reselectCheck(that._adaptor.Col);
                    f_parent.onscroll = onScroll;
                }, 500);
            }
        };
        f_parent.onscroll = onScroll;
    }

    private rebuildView = async () => {
        if (this.shouldExistLoop) { return; }
        const root = this.indexDiv.nativeElement;
        this._adaptor.Col = root.clientWidth > 1200 ? 4 : root.clientWidth > 882 ? 3 : root.clientWidth > 690 ? 2 : 1;
        if (this._adaptor.Col !== this._bindings.length) {
            this.reselectHeights(this._adaptor.Col);
        } else if (this._adaptor.Col > 1) {
            this.reselectCheck(this._adaptor.Col);
        }
        setTimeout(this.rebuildView, 150);
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
        const devalue = (max[1] - min[1]);
        if ((max[1] - min[1]) < 400) { return; }
        let num = Math.floor(devalue / 400);
        num = num > 10 ? 10 : num;
        const coll = this._bindings;
        const min_index = min[0];
        const max_index = max[0];
        const result = [coll[0] || [], coll[1] || [], coll[2] || [], coll[3] || []];
        result[min_index].push(...result[max_index].splice(result[max_index].length - 1 - num, num));
        this._bindings = result.slice(0, filt);
    }

}

