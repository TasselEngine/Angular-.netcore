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

    public static FromJson = <T>(source: string | any, typeValue?: Function | ISerializable): T => {
        return Deserialize(typeof (source) === 'string' ? JsonHelper.FromJSON(source) : source, typeValue) as T;
    }

}
