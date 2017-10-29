import { StatusDetailsComponent } from './details/details.component';
import { Routes, RouterModule } from '@angular/router';
import { CommonBaseModule } from './../commons/common.module';
import { NgZorroAntdModule } from 'ng-zorro-antd';
import { StatusIndexComponent } from './index/index.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ExtensionsModule } from '../extensions/extensions.module';

const overRoutes: Routes = [
    {
        path: '', children: [
            { path: '', component: StatusIndexComponent },
            { path: ':statusid/details', component: StatusDetailsComponent },
            { path: '**', redirectTo: '/errors/404', pathMatch: 'full' }
        ]
    }
];

@NgModule({
    declarations: [
        StatusIndexComponent,
        StatusDetailsComponent,
    ],
    imports: [
        CommonModule,
        ExtensionsModule,
        FormsModule,
        ReactiveFormsModule,
        CommonBaseModule,
        NgZorroAntdModule,
        RouterModule.forChild(overRoutes)
    ],
    providers: [],
    exports: [
        StatusIndexComponent,
        StatusDetailsComponent
    ]
})
export class StatusModule { }
