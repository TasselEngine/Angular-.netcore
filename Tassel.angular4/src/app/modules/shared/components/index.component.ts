import { Router } from '@angular/router';
import { TasselNavigationBase } from './base.component';
import { IdentityService } from './../../../services/identity/identity.service';
import { pageShowAnimation } from './../../../utils/app.utils';
import { Component, HostBinding, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';

interface IPost {
    Cover?: string;
    Title: string;
    Summary?: string;
    Like: number;
    Stamp?: string;
}

@Component({
    selector: 'tassel-root-index',
    templateUrl: './../views/index.html',
    animations: [pageShowAnimation],
    styleUrls: [
        './../styles/root.css',
        './../styles/index.css'
    ]
})
export class IndexComponent extends TasselNavigationBase implements OnInit, AfterViewInit {

    @HostBinding('@routeAnimation') routeAnimation = true;
    @HostBinding('style.display') display = 'block';

    @ViewChild('indexDiv') indexDiv: ElementRef;

    private _posts: IPost[] = [];
    public get Posts() { return this._posts; }

    private _bindings: IPost[][] = [];
    public get Bindings() { return this._bindings; }

    constructor(
        private identity: IdentityService,
        protected router: Router) { super(router); }

    ngOnInit(): void {
        this._posts = [
            { Cover: 'https://tse1-mm.cn.bing.net/th?id=OIP.C-XsFDZ4CpgjHkNFkqXQDAEsC7&p=0&pid=1.1', Title: 'Europe Street beat', Summary: 'www.instagram.com', Like: 254 },
            { Cover: 'http://img5.duitang.com/uploads/item/201407/08/20140708235628_eGnGj.jpeg', Title: 'Europe Street beat', Like: 21, Stamp: 'XXXX-XX-XX' },
            { Title: 'No Picture Test', Summary: 'www.instagram.com', Like: 213, Stamp: 'XXXX-XX-XX' },
            { Cover: 'https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png', Title: 'Europe Street beat', Summary: 'www.instagram.com', Like: 86 },
            { Cover: 'http://i5.qhimg.com/t019c2a1cad4940cf50.jpg', Title: 'Europe Street beat', Summary: 'www.instagram.com', Like: 123 },
            { Cover: 'http://a0.att.hudong.com/70/82/01300000185479121382825220187.jpg', Title: 'Europe Street beat', Summary: 'www.instagram.com', Like: 34 },
            { Cover: 'http://free-photos-ls02.gatag.net/images/lgf01a201401230500.jpg', Title: 'Europe Street beat', Like: 23, Stamp: 'XXXX-XX-XX' },
            { Cover: 'http://pic.bizhi360.com/bpic/46/5046.jpg', Title: 'Europe Street beat', Summary: 'www.instagram.com', Like: 34, Stamp: 'XXXX-XX-XX' },
            { Cover: 'http://a4.att.hudong.com/03/27/01300000066957120529279410702.jpg', Title: 'Europe Street beat', Summary: 'www.instagram.com', Like: 341 },
            { Title: 'No Picture Test', Summary: 'Sorry, there is no picture for showing, if you want see more , close the browser and get out of home.', Like: 456 },
            { Cover: 'http://uploadfile.deskcity.org/2015/0907/20150907025557427.jpg', Title: 'Europe Street beat', Summary: 'www.instagram.com', Like: 3 },
        ];
        this._bindings = reselects(this._posts, 4);
    }

    ngAfterViewInit(): void {
        this.WaitAndDo(this.rebuildView, 50);
    }

    private rebuildView = async () => {
        const root = this.indexDiv.nativeElement as HTMLDivElement;
        console.log(root.clientWidth);
        if (root.clientWidth > 1240) {
            this._bindings = reselects(this._posts, 4);
        } else if (root.clientWidth > 922) {
            this._bindings = reselects(this._posts, 3);
        } else if (root.clientWidth > 730) {
            this._bindings = reselects(this._posts, 2);
        } else {
            this._bindings = [this._posts, [], [], []];
        }
        setTimeout(this.rebuildView, 150);
    }

}

const reselects = (posts: IPost[], filt: 1 | 2 | 3 | 4): [IPost[], IPost[], IPost[], IPost[]] => {
    const result: [IPost[], IPost[], IPost[], IPost[]] = [[], [], [], []];
    posts.forEach((a, b) => { result[(b % filt)].push(a); });
    return result;
};
