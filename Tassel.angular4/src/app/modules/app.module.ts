import { GlobalInjection } from './../utils/helpers/global_injector.helper';
import { Injector } from '@angular/core';
import { LoggerService, LOGGER_SERVICE_CONFIG } from 'ws-logger';
import { environment } from './../../environments/environment';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ChartsModule } from 'ng2-charts';
import { NgZorroAntdModule, NZ_NOTIFICATION_CONFIG } from 'ng-zorro-antd';
import { RoutersModule } from './../modules/routers/routers.module';
import { SharedModule } from './../modules/shared/shared.module';
import { ExtensionsModule } from './../modules/extensions/extensions.module';
import { BrowserModule } from '@angular/platform-browser';
import { HttpModule, JsonpModule } from '@angular/http';
import { NgModule } from '@angular/core';

import { RootComponent } from './../modules/shared/components/root.component';
import { ToastService, ServerService, IdentityService, RootService } from './../services/app.service';

@NgModule({
  declarations: [
    RootComponent
  ],
  entryComponents: [],
  imports: [
    BrowserModule,
    HttpModule,
    JsonpModule,
    RoutersModule,
    SharedModule,
    ExtensionsModule,
    ChartsModule,
    BrowserAnimationsModule,
    NgZorroAntdModule.forRoot()
  ],
  providers: [
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
    ToastService,
    ServerService,
    RootService,
    IdentityService,
  ],
  bootstrap: [RootComponent]
})
export class AppModule {

  constructor(private injector: Injector) {
    GlobalInjection.Injector = injector;
  }

}
