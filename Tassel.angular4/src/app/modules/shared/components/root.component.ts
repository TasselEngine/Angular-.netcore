import { RouteStruct } from './../../../model/models/render/route.model';
import { TasselNavigationBase } from './base.component';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { Regex } from 'ws-regex';
import { IdentityService } from './../../../services/identity/identity.service';
import { Component, OnInit, HostBinding, Renderer2, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { ServerService } from '../../../services/server/server.service';
import { pageShowAnimation } from '../../../utils/app.utils';
import { UserType } from '../../../model/models/user/user.contract';

@Component({
  selector: 'tassel-root',
  templateUrl: './../views/root.html',
  styleUrls: [
    './../styles/root.scss',
  ]
})
export class RootComponent extends TasselNavigationBase implements OnInit, AfterViewInit {

  @ViewChild('rootContent') rootContent: ElementRef;

  public ShowPopover = false;
  public ShowMenu = false;
  public ShowSlider = false;
  public ShowBack = true;
  public HideAll = true;
  public HeadLeft = '0px';
  public HeaRight = '0px';

  private route_type: string;
  public get RouteFlag(): string { return this.route_type; }

  public get CurrentUser() { return this.identity.CurrentUser; }
  public get PopoverTitle() {
    return !this.CurrentUser ? '未登录' :
      this.CurrentUser.UserType !== UserType.Base ? this.CurrentUser.ScreenName :
        this.CurrentUser.UserName;
  }

  public get RouteLinks() { return this.navigator.RouteLinks; }

  constructor(
    public identity: IdentityService,
    private server: ServerService,
    private render: Renderer2,
    private route: ActivatedRoute,
    protected router: Router) { super(identity, router); }

  ngOnInit(): void {
    this.router.events.subscribe(event => {
      if (!(event instanceof NavigationEnd)) { return; }
      this.HideAll = false;
      this.ShowBack = true;
      this.route_type = undefined;
      const rs = RouteStruct.Create(this.router.routerState.snapshot.url);
      rs.DoIf(() => { this.HideAll = true; this.ShowBack = false; }, ...this.navigator.RouteLinks.Login);
      rs.DoIf(() => { this.HideAll = true; this.ShowBack = false; }, ...this.navigator.RouteLinks.Register);
      rs.DoIf(() => { this.ShowBack = false; }, ...this.navigator.RouteLinks.Home);
    });
  }

  ngAfterViewInit(): void {
    this.WaitAndDo(this.checkView, 50);
  }

  private checkView = () => {
    const root = this.rootContent.nativeElement as HTMLDivElement;
    if (root.clientWidth > 1280) {
      this.ShowSlider = true;
      // this.render.setStyle(root, 'padding', '24px 48px');
      this.HeadLeft = '0px';
      // this.HeaRight = '0px';
    } else {
      this.ShowSlider = false;
      // this.render.setStyle(root, 'padding', '24px 0px');
      this.HeadLeft = '-50px';
      // this.HeaRight = '-28px';
    }
    setTimeout(this.checkView, 300);
  }

  public Logout = () => {
    this.identity.LogoutAsync(async () => {
      this.ShowPopover = this.ShowMenu = false;
      await this.Delay(100);
      this.navigator.GoHome();
    });
  }

  public ToUserProfile = async () => {
    this.ShowPopover = this.ShowMenu = false;
    await this.Delay(100);
    this.navigator.GoToCurrentProfile();
  }

  public OnLoginClicked = () => {
    // this.toast.ComponentModal()
  }

}
