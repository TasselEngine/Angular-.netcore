
export interface IBottomPopConfig {
    title?: string;
    icon?: string;
    items: Array<IBottomPopItem>;
}

export interface IBottomPopItem {
    label: string;
    icon?: string;
    lazyClose?: boolean;
    onClick(): void;
}
