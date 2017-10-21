import { Routes, RouterModule } from '@angular/router';
import { CommonBaseModule } from './../commons/common.module';
import { NgZorroAntdModule } from 'ng-zorro-antd';
import { StatusIndexComponent } from './index/index.component';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ExtensionsModule } from '../extensions/extensions.module';

const overRoutes: Routes = [
    {
        path: '', children: [
            { path: '', component: StatusIndexComponent },
            { path: '**', redirectTo: '/errors/404', pathMatch: 'full' }
        ]
    }
];

@NgModule({
    declarations: [
        StatusIndexComponent,
    ],
    imports: [
        CommonModule,
        ExtensionsModule,
        CommonBaseModule,
        NgZorroAntdModule,
        RouterModule.forChild(overRoutes)
    ],
    providers: [],
    exports: [
        StatusIndexComponent
    ]
})
export class StatusModule { }
