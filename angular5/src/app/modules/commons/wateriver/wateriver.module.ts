import { WateriverComponent } from './wateriver.component';
import { ExtensionsModule } from './../../extensions/extensions.module';
import { NgZorroAntdModule } from 'ng-zorro-antd';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

@NgModule({
    declarations: [
        WateriverComponent
    ],
    imports: [
        CommonModule,
        ExtensionsModule,
        NgZorroAntdModule,
    ],
    providers: [],
    exports: [
        WateriverComponent
    ],
})
export class WateriverPatchModule { }
