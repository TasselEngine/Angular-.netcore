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
  styleUrls: ['./../styles/root.css']
})
export class RootComponent extends TasselNavigationBase implements OnInit, AfterViewInit {

  @ViewChild('rootContent') rootContent: ElementRef;

  public ShowPopover = false;
  public ShowSlider = true;
  public HideAll = false;

  private route_type: string;
  public get RouteFlag(): string { return this.route_type; }

  public get CurrentUser() { return this.identity.CurrentUser; }
  public get PopoverTitle() {
    return !this.CurrentUser ? '未登录' :
      this.CurrentUser.UserType !== UserType.Base ? this.CurrentUser.ScreenName :
        this.CurrentUser.UserName;
  }

  constructor(
    public identity: IdentityService,
    private server: ServerService,
    private render: Renderer2,
    private route: ActivatedRoute,
    protected router: Router) { super(router); }

  ngOnInit(): void {
    this.router.events.subscribe(event => {
      if (!(event instanceof NavigationEnd)) { return; }
      this.HideAll = false;
      this.route_type = undefined;
      const rs = RouteStruct.Create(this.router.routerState.snapshot.url);
      rs.DoIf(() => { this.HideAll = true; }, 'user', 'login');
    });
  }

  ngAfterViewInit(): void {
    this.WaitAndDo(this.checkView, 50);
  }

  private checkView = () => {
    // console.log('change view');
    const root = this.rootContent.nativeElement as HTMLDivElement;
    // console.log(root.clientWidth);
    if (root.clientWidth > 1280) {
      this.ShowSlider = true;
    } else {
      this.ShowSlider = false;
    }
    setTimeout(this.checkView, 300);
  }

  public Logout = () => {
    this.identity.LogoutAsync(() => {
      this.ShowPopover = false;
      this.navigator.GoHome();
    });
  }

  public OnLoginClicked = () => {
    // this.toast.ComponentModal()
  }

}
