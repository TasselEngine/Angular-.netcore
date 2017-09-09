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
    ],
    providers: [],
    exports: [
        IndexComponent
    ]
})
export class SharedModule { }
