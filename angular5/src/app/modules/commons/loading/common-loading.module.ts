import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { CommonLoadingComponent } from './loading.component';

@NgModule({
    declarations: [
        CommonLoadingComponent
    ],
    imports: [
        CommonModule,
    ],
    providers: [],
    exports: [
        CommonLoadingComponent
    ],
})
export class CommonLoadingModule { }
