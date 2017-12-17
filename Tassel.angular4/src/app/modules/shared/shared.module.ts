import { NgZorroAntdModule } from 'ng-zorro-antd';
import { IndexComponent } from './components/index.component';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ExtensionsModule } from '../extensions/extensions.module';
import { WaterfallPatchModule } from '../commons/waterfall/waterfall.module';
import { WateriverPatchModule } from '../commons/wateriver/wateriver.module';
import { ImageGridModule } from '../commons/imageGrid/image-grid.module';
import { CommentDivModule } from '../commons/commentDiv/comt-div.module';
import { CommonEntryModule } from '../commons/entries.module';

@NgModule({
    declarations: [
        IndexComponent,
    ],
    imports: [
        CommonModule,
        ExtensionsModule,
        CommonEntryModule,
        WaterfallPatchModule,
        WateriverPatchModule,
        ImageGridModule,
        NgZorroAntdModule
    ],
    providers: [],
    exports: [
        IndexComponent
    ]
})
export class SharedModule { }
