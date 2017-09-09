import { Regex } from './../../utils/regex.util';
import { AsyncableApiServiceBase } from './../base/service.base';
import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { RegexType } from '../../utils/regex.util';

// tslint:disable-next-line:class-name
export class LOGGER_SERVICE_CONFIG {
    constructor(public Level: number = 0, public IsProduction: boolean = false) { }
}

@Injectable()
export class LoggerService<T> extends AsyncableApiServiceBase {

    constructor(protected http: Http, private config: LOGGER_SERVICE_CONFIG) {
        super(http);
    }

    public GetLogger = <T>(typeMeta: Function, _module?: string) => {
        return new Logger<T>(this.config, typeMeta, _module);
    }

}

export class Logger<T>{

    private _comp: string;
    private _module: string;

    constructor(private config: LOGGER_SERVICE_CONFIG, typeMeta: Function, _module?: string) {
        this._comp = Regex.Create(/function (.+?)\(.+/i).Matches(typeMeta.toString(), ['FNCM'])['FNCM'];
        this._module = _module;
    }
}
