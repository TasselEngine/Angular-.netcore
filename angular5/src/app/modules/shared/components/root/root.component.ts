import { RouteStruct } from './../../../../model/models/render/route.model';
import { TasselNavigationBase } from './../base.component';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { Regex } from 'ws-regex';
import { IdentityService } from './../../../../services/identity/identity.service';
import { Component, OnInit, HostBinding, Renderer2, AfterViewInit, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import { ServerService } from '../../../../services/server/server.service';
import { pageShowAnimation } from '../../../../utils/app.utils';
import { UserType } from '../../../../model/models/user/user.contract';
import { RootService, AdminService, MessageService } from '../../../../services/app.service';
import { Title } from '@angular/platform-browser';
import { Subscription } from 'rxjs/Subscription';
import { Location } from '@angular/common';
import { WSi18N } from '../../../i18n/token';

@Component({
  selector: 'tassel-root',
  templateUrl: './root.html',
  styleUrls: [
    './root.scss',
  ]
})
export class RootComponent extends TasselNavigationBase implements OnInit, OnDestroy, AfterViewInit {

  public IsLightTheme = true;

  public ShowBack = true;
  public HideAll = true;
  public IsAdminView = false;

  public BottomMenuConfig: any;
  public PhotoGallaryImages: any;

  private oldScroll = 0;
  private isScrollUp = true;
  private startTime = new Date().getTime();

  private route_type: string;
  public get RouteFlag(): string { return this.route_type; }

  public get AppMain() { return this.server.Config.Main; }

  public get CurrentUser() { return this.identity.CurrentUser; }

  public get PopoverTitle() { return !this.CurrentUser ? 'Unknown' : this.CurrentUser.FriendlyName; }

  public get RouteLinks() { return this.navigator.RouteLinks; }

  public get IsWideScreen() { return window.innerWidth > 768; }

  private routeStruct: RouteStruct;

  constructor(
    public identity: IdentityService,
    private msgsrv: MessageService,
    private title: Title,
    private admin: AdminService,
    private render: Renderer2,
    private route: ActivatedRoute,
    private root: RootService,
    protected router: Router) { super(router); }

  ngOnInit(): void {
    this.initAppBroswerTitle();
    this.appRouteChangesDelegate();
    this.scrollPositionCacheEnabled();
    this.bottomMenuInit();
    this.photoGallatyInit();
    this.themeHookInit();
  }

  ngOnDestroy(): void {
    this.dispose();
  }

  ngAfterViewInit(): void {
    this.prepareScroll();
  }

  public OnBottomMenuClosed(e) {
    this.recoverScrollState();
  }

  public OnPhotoGallaryClosed(e) {
    this.recoverScrollState();
  }

  //#region inner methods

  private themeHookInit() {
    this.subscribe(this.root.ThemeSubject, (isLight) => {
      this.IsLightTheme = isLight;
    });
  }

  private photoGallatyInit() {
    this.subscribe(this.root.PhotoGallarySubject, (images) => {
      this.PhotoGallaryImages = images;
    });
  }

  private bottomMenuInit() {
    this.subscribe(this.root.BottomPopSubject, (config) => {
      this.checkScrollState();
      this.BottomMenuConfig = config;
    });
  }

  private checkScrollState() {
    this.oldScroll = window.scrollY;
    document.body.style.position = 'fixed';
    document.body.style.top = -this.oldScroll + 'px';
  }

  private recoverScrollState() {
    document.body.style.position = '';
    document.body.style.top = '';
    window.scrollTo(0, this.oldScroll);
  }

  private initAppBroswerTitle() {
    this.title.setTitle(`${this.server.Config.Main.Title} - ${this.server.Config.Main.Description}`);
  }

  private appRouteChangesDelegate() {
    this.router.events.subscribe(event => {
      if (!(event instanceof NavigationEnd)) {
        return;
      }
      // Rebuild scroll state
      const scroll_div = window;
      if (scroll_div) {
        scroll_div.scrollTo(0, 0);
      }
      // Reset view state properties
      this.HideAll = false;
      this.IsAdminView = false;
      this.ShowBack = true;
      this.route_type = undefined;
      // Adaptive ui changes
      const hideAll = () => {
        this.HideAll = true;
        this.ShowBack = false;
      };
      const grayBack = () => { this.ShowBack = false; };
      const isAdminView = () => { this.IsAdminView = true; };
      this.routeStruct = RouteStruct.Create(this.router)
        .DoIf(hideAll, this.navigator.RouteLinks.Login)
        .DoIf(hideAll, this.navigator.RouteLinks.Register)
        .DoEach(grayBack, this.navigator.RouteLinks.Home, this.navigator.RouteLinks.Status)
        .DoIncludes(isAdminView, this.navigator.AdminPrefix);
    });
  }

  private scrollPositionCacheEnabled() {
    this.subscribe(this.root.ScrollCheckSubject, (tmst) => {
      const scroll_div = window;
      this.root.SetScrollCache(scroll_div && scroll_div.scrollY, tmst.Key, this.router);
    });
    this.subscribe(this.root.ScrollRebuildSubject, (tmst) => {
      const scroll_div = window;
      if (typeof (tmst.ScrollY) === 'number') {
        scroll_div.scrollTo(0, tmst.ScrollY);
      } else {
        scroll_div.scrollTo(0, this.root.GetScrollState(tmst.Key, this.router));
      }
    });
  }

  private prepareScroll = () => {
    const scroll_div = window;
    const that = this;
    const onScroll = function (this: Window) {
      const bodyHeight = document.body.clientHeight;
      const nowScrollY = window.scrollY;
      const screenHeight = window.innerHeight;
      if (bodyHeight - nowScrollY - screenHeight < 100) {
        scroll_div.onscroll = null;
        setTimeout(async () => {
          that.root.OnScrollToBottom({
            element: scroll_div, invoker: async () => {
              await that.Delay(1000);
              scroll_div.onscroll = onScroll;
            }
          });
        }, 0);
      }
    };
    scroll_div.onscroll = onScroll;
  }

  //#endregion

}

