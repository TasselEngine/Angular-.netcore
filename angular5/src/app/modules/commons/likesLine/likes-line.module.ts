import { LikersLineComponent } from './likes-line.component';
import { NgZorroAntdModule } from 'ng-zorro-antd';
import { CommonModule } from '@angular/common';
import { ExtensionsModule } from './../../extensions/extensions.module';
import { NgModule } from '@angular/core';

@NgModule({
    declarations: [
        LikersLineComponent
    ],
    imports: [
        CommonModule,
        ExtensionsModule,
        NgZorroAntdModule
    ],
    providers: [],
    exports: [
        LikersLineComponent
    ],
})
export class LikersLineModule { }
