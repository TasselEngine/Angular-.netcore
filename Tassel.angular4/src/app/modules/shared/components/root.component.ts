import { TasselNavigationBase } from './base.component';
import { Router, ActivatedRoute } from '@angular/router';
import { Regex } from 'ws-regex';
import { IdentityService } from './../../../services/identity/identity.service';
import { Component, OnInit, HostBinding } from '@angular/core';
import { ServerService } from '../../../services/server/server.service';
import { pageShowAnimation } from '../../../utils/app.utils';

@Component({
  selector: 'tassel-root',
  templateUrl: './../views/root.html',
  styleUrls: ['./../styles/root.css']
})
export class RootComponent extends TasselNavigationBase implements OnInit {

  public ShowPopover = false;
  private weibo_code: string;

  public get CurrentUser() { return this.identity.CurrentUser; }
  public get PopoverTitle() {
    return !this.CurrentUser ? '未登录' :
      this.CurrentUser.WeiboUser ? this.CurrentUser.WeiboUser.ScreenName :
        this.CurrentUser.UserName;
  }

  public get WeiboAuth() {
    const href = Regex.Create(/htt.+\/\/.+?\//).Matches(window.location.href)[0];
    return `${this.server.WeiboOAuthHost}/authorize?client_id=${this.server.WeiboClientID}&response_type=code&redirect_uri=${href}`;
  }

  constructor(
    public identity: IdentityService,
    private server: ServerService,
    private route: ActivatedRoute,
    protected router: Router) { super(router); }

  ngOnInit(): void {
    this.route.queryParams.subscribe(async queryParams => {
      this.weibo_code = queryParams.code;
      if (this.weibo_code) {
        const href = Regex.Create(/htt.+\/\/.+?\//).Matches(window.location.href)[0];
        await this.identity.TryWeiboAccessAsync(this.weibo_code, href);
        this.navigator.GoHome();
      }
    });
  }

  public Logout = () => {
    this.identity.Logout();
    this.ShowPopover = false;
    this.navigator.GoHome();
  }

}
