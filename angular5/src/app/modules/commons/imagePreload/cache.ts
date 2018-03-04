export class ImageCache {

    private container: { [key: string]: boolean } = {};

    private setCache(key: string) {
        this.container[key] = true;
    }

    public Check(key: string) {
        if (this.container[key]) { return true; }
        this.setCache(key);
        return false;
    }
}

export const Container = new ImageCache();
