import { Image } from '../../status/status.model';

export interface IPhotoGallaryConfig {
    selected?: number;
    images: Array<Image>;
    srcRoot: string;
}

