
declare interface IStatusCreate {
    Content: string;
    Images: IImage[];
}

declare interface IImage {
    Name: string;
    Src: string;
    File: string;
    ThumNeed: boolean;
    SourceNeed: boolean;
    Uploaded: boolean;
    Uploading: boolean;
    UploadFailed: boolean;
    Payload?: IImagePayload;
}

declare interface IImagePayload {
    origin?: string;
    thumb?: string;
    source_need?: boolean;
    thumb_need?: boolean;
    width?: number;
    height?: number;
}