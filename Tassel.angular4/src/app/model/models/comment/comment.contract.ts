import { ICreator } from '../user/user.contract';

export interface IComment {
    id: string;
    details: string;
    creator: ICreator;
    mentioned: ICreator;
    replies: IComment[];
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
