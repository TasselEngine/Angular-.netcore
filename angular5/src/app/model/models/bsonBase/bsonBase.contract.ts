import { ModelType } from './../../enums/model.enum';


export interface IBsonBase {
    id: string;
    type: ModelType;
    create_time: number;
    update_time?: number;
}
