import { WaterfallPatchModule } from './waterfall/waterfall.module';
import { NgZorroAntdModule } from 'ng-zorro-antd';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

@NgModule({
    exports: [
        WaterfallPatchModule
    ],
})
export class CommonBaseModule { }
