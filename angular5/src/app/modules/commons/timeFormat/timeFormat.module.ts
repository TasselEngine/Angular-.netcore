import { ExtensionsModule } from './../../extensions/extensions.module';
import { NgZorroAntdModule } from 'ng-zorro-antd';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { TimeFormatPipe } from './timeFormat.pipe';

@NgModule({
    declarations: [
        TimeFormatPipe
    ],
    imports: [
        CommonModule,
    ],
    providers: [],
    exports: [
        TimeFormatPipe
    ],
})
export class TimeFormatModule { }
