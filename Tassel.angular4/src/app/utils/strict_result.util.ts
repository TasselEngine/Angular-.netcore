import { IError } from './../model/interfaces/response.interface';

export class StrictResult<T>{

    public static Success = <T>(status: number, content: T, msg?: string) => new StrictResult<T>(true, status, { msg: msg }, content).ToTuple();

    public static Failed = <T>(error: IError) => new StrictResult<T>(false, -1, error, null).ToTuple();

    constructor(private succeed: boolean, private status: number, private error: IError, private content: T) { }

    public ToTuple = (): [boolean, number, IError, T] => [this.succeed, this.status, this.error, this.content];

}
