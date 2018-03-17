import { deserializeAs, serializeAs, inheritSerialization } from 'cerialize';
import { Creator } from '../user/user.model';
import { JsonHelper } from '../../../utils/app.utils';
import { BsonBase } from '../bsonBase/bsonBase.model';
import { IUserMessage, ReadState, MessageType } from './message.contract';
import { ModelType } from '../../enums/model.enum';

export class MessageSource {

    @serializeAs(Number, 'type')
    @deserializeAs(Number, 'type')
    private type: ModelType;
    public get Type() { return this.type; }

    @serializeAs('tid')
    @deserializeAs('tid')
    private tid: string;
    public get TargetID() { return this.tid; }

    @serializeAs('abst')
    @deserializeAs('abst')
    protected abst: string;
    public get Abstract() { return this.abst; }

    @serializeAs(Number, 'host_type')
    @deserializeAs(Number, 'host_type')
    private host_type: ModelType;
    public get HostType() { return this.host_type; }

    @serializeAs('host_id')
    @deserializeAs('host_id')
    private host_id: string;
    public get HostID() { return this.host_id; }

    @serializeAs('host_abst')
    @deserializeAs('host_abst')
    protected host_abst: string;
    public get HostAbstract() { return this.host_abst; }

    private _normalized = false;

    public Normalize(transform: (content: string) => string) {
        if (this._normalized) { return; }
        this.abst = transform(this.abst);
        this.host_abst = transform(this.host_abst);
        this._normalized = true;
        return this;
    }

}

@inheritSerialization(BsonBase)
export class UserMessage extends BsonBase {

    @serializeAs(Number, 'read_state')
    @deserializeAs(Number, 'read_state')
    private read_state: ReadState;
    public get IsRead(): boolean { return this.read_state === ReadState.Read; }

    @serializeAs(Number, 'msg_type')
    @deserializeAs(Number, 'msg_type')
    private msg_type: MessageType;
    public get MessageType() { return this.msg_type; }

    @serializeAs('content')
    @deserializeAs('content')
    private details: string;
    public get Content(): string { return this._normalized ? this.details : 'Loading...'; }
    public set Content(value: string) { this.details = value; }

    @serializeAs('creator')
    @deserializeAs(Creator, 'creator')
    private creator: Creator;
    public get Creator(): Creator { return this.creator; }

    @serializeAs('user')
    @deserializeAs(Creator, 'user')
    private user: Creator;
    public get User(): Creator { return this.user; }

    @serializeAs('source')
    @deserializeAs(MessageSource, 'source')
    private source: MessageSource;
    public get Source() { return this.source; }

    private _normalized = false;

    public static Parse = (i: IUserMessage) => JsonHelper.FromJson<UserMessage>(i, UserMessage);

    public static ParseList = (coll: IUserMessage[]) => JsonHelper.FromJson<UserMessage[]>(coll, UserMessage);

    public Normalize(transform: (content: string) => string) {
        if (this._normalized) { return; }
        this.details = transform(this.details);
        this.Source.Normalize(transform);
        this._normalized = true;
        return this;
    }

}

