import { ExtensionsModule } from './../../extensions/extensions.module';
import { NgZorroAntdModule } from 'ng-zorro-antd';
import { CommonModule } from '@angular/common';
import { WaterfallComponent } from './waterfall.component';
import { NgModule } from '@angular/core';
import { AdaptorPipe } from './adaptor.pipe';

@NgModule({
    declarations: [
        AdaptorPipe,
        WaterfallComponent,
    ],
    imports: [
        CommonModule,
        ExtensionsModule,
        NgZorroAntdModule,
    ],
    providers: [],
    exports: [
        AdaptorPipe,
        WaterfallComponent
    ],
})
export class WaterfallPatchModule { }
