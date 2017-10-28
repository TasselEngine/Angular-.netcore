import { Creator } from './../user/user.model';
import { UserComment } from './../comment/comment.model';
import { FormatTime } from 'ws-format-time';
import { serializeAs, deserializeAs } from 'cerialize';
import { ICreator } from './../user/user.contract';
import { IStatus, IImage } from './status.contract';
import { EntryState, ModelType } from '../../enums/model.enum';
import { LikeRelation } from '../like/like.model';
import { JsonHelper } from '../../../utils/helpers/typed_json.helper';

const ImageHead = 'data:image/png;base64,';

export class Image {

    @serializeAs(Boolean, 'is_file')
    @deserializeAs(Boolean, 'is_file')
    private is_file: boolean;
    public get IsFile() { return this.is_file || false; }

    @serializeAs('base_64')
    @deserializeAs('base_64')
    private base_64: string;
    public get Base64() { return !this.base_64 ? undefined : ImageHead + this.base_64; }

    @serializeAs('thumb')
    @deserializeAs('thumb')
    private thumb: string;
    public get Thumbnail() { return this.thumb; }

    @serializeAs('url')
    @deserializeAs('url')
    private url: string;
    public get URL() { return this.url; }
}

export class Status {

    @serializeAs('id')
    @deserializeAs('id')
    private id: string;
    public get ID(): string { return this.id; }

    @serializeAs('images')
    @deserializeAs(Image, 'images')
    private images: Image[];
    public get Images(): Image[] { return this.images || []; }
    public get Thumbnails(): string[] { return this.Images.map(i => i.Thumbnail); }

    @serializeAs(Number, 'state')
    @deserializeAs(Number, 'state')
    private state: EntryState;
    public get State(): EntryState { return this.state || EntryState.Published; }

    @serializeAs(Number, 'type')
    @deserializeAs(Number, 'type')
    private type: ModelType;
    public get Type(): ModelType { return this.type || ModelType.Default; }

    @serializeAs('details')
    @deserializeAs('details')
    private details: string;
    public get Content(): string { return this.details; }

    @serializeAs('cover')
    @deserializeAs('cover')
    private cover: string;
    public get Cover(): string {
        return !this.cover ?
            this.Images.length > 0 ?
                this.Images[0].Base64 || this.Images[0].Thumbnail :
                undefined :
            ImageHead + this.cover;
    }

    @serializeAs('comments')
    @deserializeAs(UserComment, 'comments')
    private comments: UserComment[];
    public get Comments(): UserComment[] { return this.comments || []; }

    @serializeAs(Number, 'comments_count')
    @deserializeAs(Number, 'comments_count')
    private comments_count: number;
    public get CommentCount(): number { return this.comments_count || 0; }

    @serializeAs('liker_users')
    @deserializeAs(LikeRelation, 'liker_users')
    private liker_users: LikeRelation[];
    public get LikeUsers(): LikeRelation[] { return this.liker_users || []; }

    @serializeAs('liker_ids')
    @deserializeAs('liker_ids')
    private liker_ids: string[];
    public get LikeUserIDs(): string[] { return this.liker_ids || []; }
    public set LikeUserIDs(value: string[]) { this.liker_ids = value; }

    @serializeAs(Number, 'likers_count')
    @deserializeAs(Number, 'likers_count')
    private likers_count: number;
    public get LikersCount(): number { return this.likers_count || 0; }
    public set LikersCount(value: number) { this.likers_count = value; }

    @serializeAs('creator')
    @deserializeAs(Creator, 'creator')
    private creator: Creator;
    public get Creator(): Creator { return this.creator; }

    @serializeAs(Number, 'create_time')
    @deserializeAs(Number, 'create_time')
    private create_time: number;
    private cttm: FormatTime;
    public get CreateTime(): FormatTime {
        return !this.create_time ? undefined :
            this.cttm || (this.cttm = FormatTime.Create(!this.create_time ? undefined : this.create_time * 1000, 0));
    }

    @serializeAs(Number, 'update_time')
    @deserializeAs(Number, 'update_time')
    private update_time: number;
    private uttm: FormatTime;
    public get UpdateTime(): FormatTime {
        return !this.update_time ? undefined :
            this.uttm || (this.uttm = FormatTime.Create(!this.update_time ? undefined : this.update_time * 1000, 0));
    }

    public static Parse = (i: IStatus) => JsonHelper.FromJson<Status>(i, Status);

    public static ParseList = (coll: IStatus[]) => JsonHelper.FromJson<Status[]>(coll, Status);

    public readonly ParseUrls = (head: string, target?: 'origin' | 'normal' | 'large'): string[] => {
        if (!target) {
            return this.Thumbnails.map(i => head + i);
        }
        switch (target) {
            case 'origin': return this.Images.map(i => head + i.URL);
            default: return this.Thumbnails.map(i => head + i);
        }
    }

}

