import { NgZorroAntdModule } from 'ng-zorro-antd';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { LabelSwitchComponent } from './switch.component';
import { FormsModule } from '@angular/forms';

@NgModule({
    declarations: [
        LabelSwitchComponent
    ],
    imports: [
        CommonModule,
        FormsModule,
        NgZorroAntdModule
    ],
    providers: [],
    exports: [
        LabelSwitchComponent
    ],
})
export class LabelSwitchModule { }
