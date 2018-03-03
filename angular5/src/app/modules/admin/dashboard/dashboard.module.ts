import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ExtensionsModule } from '../../extensions/extensions.module';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NgZorroAntdModule } from 'ng-zorro-antd';
import { AdminDashboardComponent } from './index/dashboard.component';
import { AdminUserNameDisplayPipe } from './index/user-display.pipe';
import { AdminUserTableComponent } from './users-table/user-table.component';
import { AdminDashLogsComponent } from './logs-tab/logs.component';
import { TimeFormatModule } from '../../commons/timeFormat/timeFormat.module';
import { CommonLoadingModule } from '../../commons/loading/common-loading.module';

@NgModule({
    declarations: [
        AdminDashboardComponent,
        AdminUserTableComponent,
        AdminDashLogsComponent,
        AdminUserNameDisplayPipe
    ],
    imports: [
        CommonModule,
        ExtensionsModule,
        FormsModule,
        TimeFormatModule,
        NgZorroAntdModule,
        CommonLoadingModule
    ],
    providers: [],
    exports: [
        AdminDashboardComponent,
        AdminUserNameDisplayPipe
    ]
})
export class AdminDashboargModule { }
