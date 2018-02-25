import { ICreator } from '../user/user.contract';
import { LogRole, LogLevel, LogAction, ModelType } from '../../enums/model.enum';

export interface IServerLog {
    type: ModelType;
    level: LogLevel;
    role: LogRole;
    action: LogAction;
    target_type: ModelType;
    target_id: string;
    target_key: string;
    desc: string;
    creator: ICreator;
    id: string;
    create_time: number;
    update_time: number;
}
