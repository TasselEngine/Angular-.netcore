import { HttpClient } from '@angular/common/http';
import { LoggerService } from 'ws-logger';
import { AsyncableClassBase } from 'ws-async-base';
import { FormatHttpAsyncClient } from 'ws-format-httprequest';
import { ToastService } from '../toast/toast.service';
import { GlobalInjection } from '../../utils/helpers/global_injector.helper';

export class AsyncableServiceBase extends AsyncableClassBase {

    protected toast: ToastService;
    protected logsrv: LoggerService;

    constructor() {
        super();
        this.toast = GlobalInjection.Injector.get(ToastService);
        this.logsrv = GlobalInjection.Injector.get(LoggerService);
    }

}

export class HttpAsyncClientBase<T> extends FormatHttpAsyncClient<T> {

    protected toast: ToastService;
    protected logsrv: LoggerService;

    constructor(protected http: HttpClient) {
        super(http);
        this.toast = GlobalInjection.Injector.get(ToastService);
        this.logsrv = GlobalInjection.Injector.get(LoggerService);
    }

}
