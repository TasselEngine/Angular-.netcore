import { Serialize, ISerializable, Deserialize } from 'cerialize';


export class JsonHelper {

    public static ToJSON = (target: any): string => JSON.stringify(target);

    public static FromJSON = (jsonStr: string): any => JSON.parse(jsonStr);

    public static ToJson = <T>(target: T, typeValue?: Function | ISerializable): string => Serialize(target, typeValue);

    public static FromJson = <T>(jsonStr: string, typeValue?: Function | ISerializable): T => Deserialize(JSON.parse(jsonStr), typeValue) as T;

}
