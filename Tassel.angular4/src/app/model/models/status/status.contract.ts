import { ILikeRelation } from './../like/like.contract';
import { IComment } from './../comment/comment.contract';
import { ICreator } from './../user/user.contract';
import { EntryState, ModelType } from '../../enums/model.enum';

export interface IStatus {
    images: IImage;
    type: ModelType;
    state: EntryState;
    details: string;
    cover: string;
    comments: IComment[];
    comments_count: number;
    liker_users?: ILikeRelation[];
    likers_count: number;
    liker_ids?: string[];
    creator: ICreator;
    id: string;
    create_time: number;
    update_time: number;
}

export interface IImage {
    is_file: boolean;
    base_64: string;
    thumb: string;
    url: string;
}
