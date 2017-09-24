import { Serialize, ISerializable, Deserialize } from 'cerialize';


export class JsonHelper {

    public static ToJSON = (target: any): string => JSON.stringify(target);

    public static FromJSON = (jsonStr: string): any => {
        try {
            return JSON.parse(jsonStr);
        } catch (error) {
            return undefined;
        }
    }

    public static ToJson = <T>(target: T, typeValue?: Function | ISerializable): string => Serialize(target, typeValue);

    public static FromJson = <T>(jsonStr: string, typeValue?: Function | ISerializable): T => Deserialize(JsonHelper.FromJSON(jsonStr), typeValue) as T;

}
