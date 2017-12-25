import { serializeAs, deserializeAs } from 'cerialize';
import { FormatTime } from 'ws-format-time';
import { ModelType } from './../../enums/model.enum';


export class BsonBase {

    @serializeAs('id')
    @deserializeAs('id')
    private id: string;
    public get ID(): string { return this.id; }

    @serializeAs(Number, 'type')
    @deserializeAs(Number, 'type')
    private type: ModelType;
    public get Type(): ModelType { return this.type || ModelType.Default; }

    @serializeAs(Number, 'create_time')
    @deserializeAs(Number, 'create_time')
    private create_time: number;
    private cttm: FormatTime;
    public get CreateTimeUnix() { return this.create_time || 0; }
    public get CreateTime(): FormatTime {
        return !this.create_time ? undefined :
            this.cttm || (this.cttm = FormatTime.Create(!this.create_time ? undefined : this.create_time * 1000, 0));
    }

    @serializeAs(Number, 'update_time')
    @deserializeAs(Number, 'update_time')
    private update_time: number;
    private uttm: FormatTime;
    public get UpdateTimeUnix() { return this.update_time || 0; }
    public get UpdateTime(): FormatTime {
        return !this.update_time ? undefined :
            this.uttm || (this.uttm = FormatTime.Create(!this.update_time ? undefined : this.update_time * 1000, 0));
    }

}
