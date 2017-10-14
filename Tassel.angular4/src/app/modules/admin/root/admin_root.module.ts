import { DashIndexComponent } from './components/index.component';
import { CommonModule } from '@angular/common';
import { ExtensionsModule } from './../../extensions/extensions.module';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { NgZorroAntdModule } from 'ng-zorro-antd';
import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';

const overRoutes: Routes = [
    {
        path: '', children: [
            { path: 'index', component: DashIndexComponent },
            { path: '**', redirectTo: '/errors/404', pathMatch: 'full' },
            { path: '', redirectTo: 'index', pathMatch: 'full' }
        ]
    }
];

@NgModule({
    declarations: [
        DashIndexComponent
    ],
    imports: [
        CommonModule,
        ExtensionsModule,
        FormsModule,
        ReactiveFormsModule,
        NgZorroAntdModule,
        RouterModule.forChild(overRoutes)
    ],
    providers: [],
    exports: [
        DashIndexComponent
    ]
})
export class AdminRootModule { }
