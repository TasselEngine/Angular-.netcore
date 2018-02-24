import { AdminStatusComponent } from './status/status.component';
import { AdminDashboardComponent } from './dashboard/index/dashboard.component';
import { ImageUpListModule } from '../commons/imageUploadList/img_upload.module';
import { StickersGroupModule } from '../commons/stickersGroup/stickers-group.module';
import { CommonModule } from '@angular/common';
import { ExtensionsModule } from './../extensions/extensions.module';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { NgZorroAntdModule } from 'ng-zorro-antd';
import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { TinyMCEModule } from '../commons/tinyEditor/tinymce.module';
import { AdminDashboargModule } from './dashboard/dashboard.module';

const overRoutes: Routes = [
    {
        path: '', children: [
            { path: 'dashboard', component: AdminDashboardComponent },
            { path: 'status', component: AdminStatusComponent },
            { path: '**', redirectTo: '/errors/404', pathMatch: 'full' },
            { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
        ]
    }
];

@NgModule({
    declarations: [
        AdminStatusComponent
    ],
    imports: [
        CommonModule,
        ExtensionsModule,
        FormsModule,
        StickersGroupModule,
        ReactiveFormsModule,
        ImageUpListModule,
        NgZorroAntdModule,
        TinyMCEModule,
        RouterModule.forChild(overRoutes),
        AdminDashboargModule
    ],
    providers: [],
    exports: [
        AdminDashboardComponent,
        AdminStatusComponent
    ]
})
export class AdminModule { }
