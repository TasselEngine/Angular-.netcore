import { ICreator } from './../user/user.contract';

export interface ILikeRelation {
    user: ICreator;
    create_time: number;
}
