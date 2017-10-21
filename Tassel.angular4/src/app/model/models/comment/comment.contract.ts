import { ICreator } from '../user/user.contract';

export interface IComment {
    id: string;
    details: string;
    creator: ICreator;
    create_time: number;
    update_time: number;
}