import { LoggerService, LOGGER_SERVICE_CONFIG } from 'ws-logger';
import { environment } from './../environments/environment';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ChartsModule } from 'ng2-charts';
import { NgZorroAntdModule } from 'ng-zorro-antd';
import { IdentityService } from './services/identity/identity.service';
import { RoutersModule } from './modules/routers/routers.module';
import { SharedModule } from './modules/shared/shared.module';
import { ExtensionsModule } from './modules/extensions/extensions.module';
import { BrowserModule } from '@angular/platform-browser';
import { HttpModule, JsonpModule } from '@angular/http';
import { NgModule } from '@angular/core';

import { RootComponent } from './modules/shared/components/root.component';

let level = 0;
let isProd = false;
if (environment.production) {
  level = 1;
  isProd = true;
}

@NgModule({
  declarations: [
    RootComponent
  ],
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
    IdentityService,
    { provide: LOGGER_SERVICE_CONFIG, useValue: { Level: level, IsProduction: isProd } },
    LoggerService
  ],
  bootstrap: [RootComponent]
})
export class AppModule { }
