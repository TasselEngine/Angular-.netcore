import { JsonHelper } from './../../../utils/helpers/typed_json.helper';
import { FormatTime } from 'ws-format-time';
import { deserializeAs, serializeAs } from 'cerialize';
import { Creator } from './../user/user.model';
import { ILikeRelation } from './like.contract';

export class LikeRelation {

    @serializeAs('user')
    @deserializeAs(Creator, 'user')
    private creator: Creator;
    public get Creator(): Creator { return this.creator; }

    @serializeAs(Number, 'create_time')
    @deserializeAs(Number, 'create_time')
    private create_time: number;
    private cttm: FormatTime;
    public get CreateTime(): FormatTime {
        return this.cttm || (this.cttm = FormatTime.Create(!this.create_time ? undefined : this.create_time * 1000, 0));
    }

    constructor(user?: Creator, time?: FormatTime) {
        this.creator = user;
        this.cttm = time;
    }

    public static Parse = (i: ILikeRelation) => JsonHelper.FromJson<LikeRelation>(i, LikeRelation);

}
