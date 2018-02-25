import { IServerLog } from './log.contract';
import { ModelType, LogLevel, LogRole, LogAction } from '../../enums/model.enum';
import { serializeAs, deserializeAs } from 'cerialize';
import { Creator } from '../user/user.model';
import { SrvTimeFormat } from './../../interfaces/response.interface';
import { FormatTime } from 'ws-format-time';
import { JsonHelper } from '../../../utils/app.utils';

export class ApplicationLog {

    @serializeAs('type')
    @deserializeAs(Number, 'type')
    private type: ModelType;
    public get Type() { return this.type; }

    @serializeAs('level')
    @deserializeAs(Number, 'level')
    private level: LogLevel;
    public get Level() { return this.level; }

    @serializeAs('role')
    @deserializeAs(Number, 'role')
    private role: LogRole;
    public get Role() { return this.role; }

    @serializeAs('action')
    @deserializeAs(Number, 'action')
    private action: LogAction;
    public get Action() { return this.action; }

    @serializeAs('target_type')
    @deserializeAs(Number, 'target_type')
    private target_type: ModelType;
    public get TargetType() { return this.target_type; }

    @serializeAs('target_id')
    @deserializeAs('target_id')
    private target_id: string;
    public get TargetID() { return this.target_id; }

    @serializeAs('target_key')
    @deserializeAs('target_key')
    private target_key: string;
    public get TargetKey() { return this.target_key; }
    public set TargetKey(value: string) { this.target_key = value; }

    @serializeAs('desc')
    @deserializeAs('desc')
    private desc: string;
    public get Description() { return this.desc; }

    @serializeAs(Creator, 'creator')
    @deserializeAs(Creator, 'creator')
    private creator: Creator;
    public get Creator() { return this.creator; }

    @serializeAs('id')
    @deserializeAs('id')
    private id: string;
    public get ID() { return this.id; }

    @serializeAs('create_time')
    @deserializeAs(Number, 'create_time')
    private create_time: number;
    private _createTime: FormatTime;
    public get CreateTime() {
        return this._createTime || (this._createTime = FormatTime.Create(1000 * (this.create_time || 0)));
    }

    @serializeAs('update_time')
    @deserializeAs(Number, 'update_time')
    private update_time: number;
    private _updateTime: FormatTime;
    public get UpdateTime() {
        return this._updateTime || (this._updateTime = FormatTime.Create(1000 * (this.update_time || 0)));
    }

    public static Parse = (iuser: IServerLog) => JsonHelper.FromJson<ApplicationLog>(JsonHelper.ToJSON(iuser), ApplicationLog);

    public static ParseList = (iusers: IServerLog[]) => (iusers || []).map(iuser => JsonHelper.FromJson<ApplicationLog>(JsonHelper.ToJSON(iuser), ApplicationLog));

}
