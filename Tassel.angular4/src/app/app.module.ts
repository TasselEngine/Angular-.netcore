import { NgZorroAntdModule } from 'ng-zorro-antd';
import { IdentityService } from './services/identity.service';
import { RoutersModule } from './modules/routers/routers.module';
import { SharedModule } from './modules/shared/shared.module';
import { ExtensionsModule } from './modules/extensions/extensions.module';
import { BrowserModule } from '@angular/platform-browser';
import { HttpModule, JsonpModule } from '@angular/http';
import { NgModule } from '@angular/core';

import { RootComponent } from './modules/shared/components/root.component';

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
    NgZorroAntdModule.forRoot()
  ],
  providers: [
    IdentityService
  ],
  bootstrap: [RootComponent]
})
export class AppModule { }
