import { NgModule, Component } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const mainRoutes: Routes = [
    { path: '**', redirectTo: '', pathMatch: 'full' }
];

@NgModule({
    declarations: [],
    imports: [
        RouterModule.forRoot(mainRoutes)
    ],
    providers: [],
    exports: [
        RouterModule
    ]
})
export class RoutersModule { }
