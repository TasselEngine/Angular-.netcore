import { ExtensionsModule } from './../extensions/extensions.module';
import { Routes, RouterModule } from '@angular/router';
import { SettingsIndexComponent } from './components/index.component';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

const overRoutes: Routes = [
    { path: 'index', component: SettingsIndexComponent },
    { path: '', redirectTo: 'index', pathMatch: 'full' },
    { path: '**', redirectTo: '/errors/404', pathMatch: 'full' }
];

@NgModule({
    declarations: [
        SettingsIndexComponent,
    ],
    imports: [
        CommonModule,
        ExtensionsModule,
        RouterModule.forChild(overRoutes)
    ],
    providers: [],
    exports: [
        SettingsIndexComponent
    ]
})
export class SettingsModule { }
