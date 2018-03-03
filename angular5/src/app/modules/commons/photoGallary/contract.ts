export interface Image {
    thumb?: string;
    origin?: string;
}

export interface Config {
    selected?: number;
    images: Array<Image>;
    root?: string;
}


