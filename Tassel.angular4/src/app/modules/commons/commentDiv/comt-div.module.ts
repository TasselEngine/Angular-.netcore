import { CommentDivComponent } from './comt-div.component';
import { NgZorroAntdModule } from 'ng-zorro-antd';
import { CommonModule } from '@angular/common';
import { ExtensionsModule } from './../../extensions/extensions.module';
import { NgModule } from '@angular/core';

@NgModule({
    declarations: [
        CommentDivComponent
    ],
    imports: [
        CommonModule,
        ExtensionsModule,
        NgZorroAntdModule
    ],
    providers: [],
    exports: [
        CommentDivComponent
    ],
})
export class CommentDivModule { }
