import { NgZorroAntdModule } from 'ng-zorro-antd';
import { IndexComponent } from './components/index/index.component';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ExtensionsModule } from '../extensions/extensions.module';
import { WaterfallPatchModule } from '../commons/waterfall/waterfall.module';
import { WateriverPatchModule } from '../commons/wateriver/wateriver.module';
import { ImageGridModule } from '../commons/imageGrid/image-grid.module';
import { CommentDivModule } from '../commons/commentDiv/comt-div.module';
import { CommonEntryModule } from '../commons/entries.module';
import { CommonLoadingModule } from '../commons/loading/common-loading.module';
import { LeftCommonContainerComponent } from './components/left-container/common/common.component';
import { RootComponent } from './components/root/root.component';
import { RoutersModule } from '../routers/routers.module';
import { UserDivComponent } from './components/user-div/user-div.component';

@NgModule({
    declarations: [
        RootComponent,
        IndexComponent,
        UserDivComponent,
        LeftCommonContainerComponent,
    ],
    imports: [
        CommonModule,
        RoutersModule,
        ExtensionsModule,
        CommonEntryModule,
        WaterfallPatchModule,
        WateriverPatchModule,
        ImageGridModule,
        NgZorroAntdModule,
        CommonLoadingModule
    ],
    providers: [],
    exports: [
        RoutersModule,
        RootComponent,
        IndexComponent
    ]
})
export class SharedModule { }
