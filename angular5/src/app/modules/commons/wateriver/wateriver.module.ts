import { WateriverComponent } from './wateriver.component';
import { ExtensionsModule } from './../../extensions/extensions.module';
import { NgZorroAntdModule } from 'ng-zorro-antd';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { CommonLoadingModule } from '../loading/common-loading.module';

@NgModule({
    declarations: [
        WateriverComponent
    ],
    imports: [
        CommonModule,
        ExtensionsModule,
        NgZorroAntdModule,
        CommonLoadingModule
    ],
    providers: [],
    exports: [
        WateriverComponent
    ],
})
export class WateriverPatchModule { }
