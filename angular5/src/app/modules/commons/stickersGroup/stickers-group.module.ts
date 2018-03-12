import { KeyDisplayPipe } from './key-display.pipe';
import { NgZorroAntdModule } from 'ng-zorro-antd';
import { CommonModule } from '@angular/common';
import { ExtensionsModule } from './../../extensions/extensions.module';
import { NgModule } from '@angular/core';
import { StickersGroupComponent } from './stickers-group.component';
import { WSi18nModule } from '../../i18n/i18n.module';

@NgModule({
    declarations: [
        StickersGroupComponent,
        KeyDisplayPipe
    ],
    imports: [
        WSi18nModule,
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
