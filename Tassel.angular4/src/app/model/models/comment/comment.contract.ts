import { ICreator } from '../user/user.contract';
import { ModelType } from '../../enums/model.enum';

export interface IComment {
    id: string;
    details: string;
    creator: ICreator;
    mentioned: ICreator;
    replies: IComment[];
    ptpye?: ModelType;
    parent_id?: string;
    create_time: number;
    update_time: number;
}

export interface ICommentCreate {
    uid: string;
    user_name: string;
    content: string;
    m_uid?: string;
    mend_user?: string;
    com_id?: string;
    is_reply: boolean;
}

export interface ICommentDelete {
    id: string;
    com_id?: string;
    is_reply: boolean;
    reply_id?: string;
}
