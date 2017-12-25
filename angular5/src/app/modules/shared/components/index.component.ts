import { Subscription } from 'rxjs/Subscription';
import { Router } from '@angular/router';
import { TasselNavigationBase } from './base.component';
import { IdentityService } from './../../../services/identity/identity.service';
import { pageShowAnimation } from './../../../utils/app.utils';
import { Component, HostBinding, OnInit, ViewChild, ElementRef, AfterViewInit, OnDestroy, OnChanges, SimpleChanges } from '@angular/core';
import { RootService } from '../../../services/app.service';

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
        './../styles/index.scss'
    ]
})
export class IndexComponent extends TasselNavigationBase implements OnInit, OnDestroy {

    @HostBinding('@routeAnimation') routeAnimation = true;
    @HostBinding('style.display') display = 'block';

    public get IsWideScreen() { return window.innerWidth > 768; }

    private _posts: IPost[];
    public get Posts() { return this._posts; }

    constructor(
        private root: RootService,
        protected identity: IdentityService,
        protected router: Router) { super(identity, router); }

    ngOnInit(): void {
    }

    ngOnDestroy(): void {
    }

    public postsProvide = () => {
        return [
            { Cover: 'https://tse1-mm.cn.bing.net/th?id=OIP.C-XsFDZ4CpgjHkNFkqXQDAEsC7&p=0&pid=1.1', Title: '我是一只猫', Summary: '中文测试', Like: 254 },
            { Cover: 'http://p3.wmpic.me/article/2016/07/25/1469459240_PzFfSySK.jpg', Title: 'Europe Street beat', Like: 21, Stamp: 'XXXX-XX-XX' },
            { Title: '什么图片都没有', Summary: '别做梦了。', Like: 213, Stamp: 'XXXX-XX-XX' },
            { Cover: 'https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png', Title: 'Europe Street beat', Summary: 'www.instagram.com', Like: 86 },
            { Cover: 'http://i5.qhimg.com/t019c2a1cad4940cf50.jpg', Title: 'Europe Street beat', Summary: 'www.instagram.com', Like: 123 },
            { Cover: 'http://a0.att.hudong.com/70/82/01300000185479121382825220187.jpg', Title: 'Europe Street beat', Summary: 'www.instagram.com', Like: 34 },
            { Cover: 'http://free-photos-ls02.gatag.net/images/lgf01a201401230500.jpg', Title: 'Europe Street beat', Like: 23, Stamp: 'XXXX-XX-XX' },
            { Cover: 'http://pic.nvsheng.com/upload/attach/2015/04/3626-2bpaJfh.jpg', Title: 'Europe Street beat', Summary: 'www.instagram.com', Like: 34, Stamp: 'XXXX-XX-XX' },
            { Cover: 'http://a4.att.hudong.com/03/27/01300000066957120529279410702.jpg', Title: 'Europe Street beat', Summary: 'www.instagram.com', Like: 341 },
            { Title: 'No Picture Test', Summary: 'Sorry, there is no picture for showing, if you want see more , close the browser and get out of home.', Like: 456 },
            { Cover: 'http://pic.7y7.com/Uploads/Former/20148/2014083037415845_0_0_water.jpg', Title: 'Something Wrong', Summary: '......', Like: 34524 },
            { Cover: 'http://uploadfile.deskcity.org/2015/0907/20150907025557427.jpg', Title: 'Europe Street beat', Summary: 'www.instagram.com', Like: 3 },
        ];
    }

}

