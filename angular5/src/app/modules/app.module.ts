import { GlobalInjection } from './../utils/helpers/global_injector.helper';
import { LoggerService, LOGGER_SERVICE_CONFIG } from 'ws-logger';
import { environment } from './../../environments/environment';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgZorroAntdModule, NZ_NOTIFICATION_CONFIG } from 'ng-zorro-antd';
import { RoutersModule } from './../modules/routers/routers.module';
import { SharedModule } from './../modules/shared/shared.module';
import { ExtensionsModule } from './../modules/extensions/extensions.module';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { NgModule, APP_INITIALIZER, Injector } from '@angular/core';
import { RootComponent } from './../modules/shared/components/root.component';
import {
  ToastService, ServerService, IdentityService,
  RootService, StatusService, FormatService,
  AdminService, ResourcesService, UtilsService,
  CacheService, RouterService
} from './../services/app.service';

export function AppInit(config: ServerService) {
  return async () => {
    return await config.LoadConfig();
  };
}

@NgModule({
  declarations: [
    RootComponent
  ],
  entryComponents: [],
  imports: [
    BrowserModule,
    HttpClientModule,
    RoutersModule,
    SharedModule,
    ExtensionsModule,
    BrowserAnimationsModule,
    NgZorroAntdModule.forRoot()
  ],
  providers: [
    {
      provide: APP_INITIALIZER,
      useFactory: AppInit,
      deps: [ServerService],
      multi: true
    },
    {
      provide: NZ_NOTIFICATION_CONFIG, useValue: {
        nzTop: '24px',
        nzRight: '0px',
        nzDuration: 3000,
        nzMaxStack: 5,
        nzPauseOnHover: true,
        nzAnimate: true
      }
    },
    {
      provide: LOGGER_SERVICE_CONFIG, useValue: {
        Level: environment.logLevel,
        IsProduction: environment.production
      }
    },
    LoggerService,
    RouterService,
    ToastService,
    ServerService,
    CacheService,
    RootService,
    StatusService,
    FormatService,
    IdentityService,
    AdminService,
    ResourcesService,
    UtilsService
  ],
  bootstrap: [RootComponent]
})
export class AppModule {

  constructor(private injector: Injector) {
    GlobalInjection.Injector = injector;
  }

}
