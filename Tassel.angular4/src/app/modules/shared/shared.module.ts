import { NgZorroAntdModule } from 'ng-zorro-antd';
import { IndexComponent } from './components/index.component';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ExtensionsModule } from '../extensions/extensions.module';

@NgModule({
    declarations: [
        IndexComponent,
    ],
    imports: [
        CommonModule,
        ExtensionsModule,
        NgZorroAntdModule
    ],
    providers: [],
    exports: [
        IndexComponent
    ]
})
export class SharedModule { }
