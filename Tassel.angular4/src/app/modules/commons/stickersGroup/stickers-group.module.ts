import { NgZorroAntdModule } from 'ng-zorro-antd';
import { CommonModule } from '@angular/common';
import { ExtensionsModule } from './../../extensions/extensions.module';
import { NgModule } from '@angular/core';
import { StickersGroupComponent } from './stickers-group.component';

@NgModule({
    declarations: [
        StickersGroupComponent
    ],
    imports: [
        CommonModule,
        ExtensionsModule,
        NgZorroAntdModule
    ],
    providers: [],
    exports: [
        StickersGroupComponent
    ],
})
export class StickersGroupModule { }
