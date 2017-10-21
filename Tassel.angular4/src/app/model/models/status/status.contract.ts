import { ICreator } from './../user/user.contract';
import { EntryState } from '../../enums/model.enum';

export interface IStatus {
    images: IImage;
    state: EntryState;
    details: string;
    cover: string;
    comments: any[];
    comments_count: number;
    liker_users: any[];
    likers_count: number;
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
