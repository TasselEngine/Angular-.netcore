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
import { BottomMenuComponent } from './components/bottom-menu/bottomMenu.component';
import { LeftAdminContainerComponent } from './components/left-container/admin/admin.component';
import { PhotoGallaryModule } from '../commons/photoGallary/photo-gallary.module';
import { WSi18nModule } from '../i18n/i18n.module';
import { LabelSwitchModule } from '../commons/switch/switch.module';

@NgModule({
    declarations: [
        RootComponent,
        IndexComponent,
        UserDivComponent,
        BottomMenuComponent,
        LeftAdminContainerComponent,
        LeftCommonContainerComponent,
    ],
    imports: [
        WSi18nModule,
        CommonModule,
        RoutersModule,
        ExtensionsModule,
        CommonEntryModule,
        WaterfallPatchModule,
        WateriverPatchModule,
        ImageGridModule,
        PhotoGallaryModule,
        NgZorroAntdModule,
        CommonLoadingModule,
        LabelSwitchModule
    ],
    providers: [],
    exports: [
        RoutersModule,
        RootComponent,
        IndexComponent
    ]
})
export class SharedModule { }
