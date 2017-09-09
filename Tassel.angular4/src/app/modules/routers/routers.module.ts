import { IndexComponent } from './../shared/components/index.component';
import { NgModule, Component } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const mainRoutes: Routes = [
    { path: 'index', component: IndexComponent },
    { path: 'settings', loadChildren: './../settings/settings.module#SettingsModule' },
    { path: '', redirectTo: 'index', pathMatch: 'full' },
    { path: '**', redirectTo: '/errors/404', pathMatch: 'full' }
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
