import { ExtensionsModule } from './../../extensions/extensions.module';
import { NgZorroAntdModule } from 'ng-zorro-antd';
import { CommonModule } from '@angular/common';
import { WaterfallComponent } from './waterfall.component';
import { NgModule } from '@angular/core';
import { AdaptorPipe } from './adaptor.pipe';
import { CommonLoadingModule } from '../loading/common-loading.module';

@NgModule({
    declarations: [
        AdaptorPipe,
        WaterfallComponent,
    ],
    imports: [
        CommonModule,
        ExtensionsModule,
        NgZorroAntdModule,
        CommonLoadingModule
    ],
    providers: [],
    exports: [
        AdaptorPipe,
        WaterfallComponent
    ],
})
export class WaterfallPatchModule { }
