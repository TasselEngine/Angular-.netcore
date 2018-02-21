
export interface IBottomPopConfig {
    title?: string;
    items: Array<IBottomPopItem>;
}

export interface IBottomPopItem {
    label: string;
    lazyClose?: boolean;
    onClick(): void;
}
