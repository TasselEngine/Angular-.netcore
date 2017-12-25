
export class Queue<T>{

    private coll: T[] = [];

    private readonly capacity: number;
    public get Capacity() { return this.capacity; }

    public get Items(): T[] { return this.coll; }

    constructor(capacity: number = 20) {
        this.capacity = capacity;
    }

    public readonly Push = (item: T): boolean => {
        if (this.coll.length >= this.capacity) {
            return false;
        }
        this.coll.push(item);
        return true;
    }

    public readonly Out = (): T => {
        if (this.coll.length === 0) {
            return undefined;
        }
        return this.coll.splice(0, 1)[0];
    }

    public readonly Head = (): T => {
        if (this.coll.length === 0) {
            return undefined;
        }
        return this.coll[0];
    }

}
