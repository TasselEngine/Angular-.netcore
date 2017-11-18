import { ILikeRelation } from './../like/like.contract';
import { IComment } from './../comment/comment.contract';
import { ICreator } from './../user/user.contract';
import { EntryState, ModelType } from '../../enums/model.enum';
import { IBsonBase } from '../bsonBase/bsonBase.contract';

export interface IStatus extends IBsonBase {
    images: IImage;
    state: EntryState;
    details: string;
    cover: string;
    comments: IComment[];
    comments_count: number;
    like_users?: ILikeRelation[];
    likers_count: number;
    liker_ids?: string[];
    creator: ICreator;
}

export interface IImage {
    is_file: boolean;
    base_64: string;
    thumb: string;
    url: string;
}
