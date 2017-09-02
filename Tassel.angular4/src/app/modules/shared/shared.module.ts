import { NavComponent } from './components/nav.component';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

@NgModule({
    declarations: [
        NavComponent,
    ],
    imports: [
        CommonModule,
    ],
    providers: [],
    exports: [
        NavComponent,
    ]
})
export class SharedModule { }