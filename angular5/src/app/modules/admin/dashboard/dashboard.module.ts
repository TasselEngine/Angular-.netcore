import { NgModule } from '@angular/core';
import { AdminDashboardComponent } from './index/dashboard.component';
import { CommonModule } from '@angular/common';
import { ExtensionsModule } from '../../extensions/extensions.module';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NgZorroAntdModule } from 'ng-zorro-antd';
import { AdminUserNameDisplayPipe } from './index/user-display.pipe';

@NgModule({
    declarations: [
        AdminDashboardComponent,
        AdminUserNameDisplayPipe
    ],
    imports: [
        CommonModule,
        ExtensionsModule,
        FormsModule,
        NgZorroAntdModule
    ],
    providers: [],
    exports: [
        AdminDashboardComponent,
        AdminUserNameDisplayPipe
    ]
})
export class AdminDashboargModule { }
