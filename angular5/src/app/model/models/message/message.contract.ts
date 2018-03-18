import { IBsonBase } from '../bsonBase/bsonBase.contract';
import { ICreator } from '../user/user.contract';
import { ModelType } from '../../enums/model.enum';

export enum ReadState {
    Unread = 0,
    Read = 1
}

export enum MessageType {
    Default = 0,
    Reply = 1,
    Comment = 2,
    Like = 3,
    Methioned = 4,
    Repost = 5,
    Follow = 6,
    Chat = 7,
}

export interface IMessageSource {
    type: ModelType;
    tid: string;
    abst: string;
    host_type: ModelType;
    host_id: string;
    host_abst: string;
    target_abst: string;
}

export interface IUserMessage extends IBsonBase {
    read_state: ReadState;
    msg_type: MessageType;
    content: string;
    source: IMessageSource;
    user: ICreator;
    creator: ICreator;
}
