
export enum ModelType {
    Default = 0,
    User = 1,
    WeiboUser = 2,
    Comment = 11,
    LikeEntry = 12,
    Status = 13,
    Post = 14,
    Message = 21,
    Log = 31,
}

export enum EntryState {
    Published = 0,
    Unpublished = 1,
    Blacklist = 2,
    Deleted = 3
}

export enum LogRole {
    User = 2,
    Admin = 1,
    Core = 0,
    Error = -1
}

export enum LogLevel {
    Debug = 0,
    Info = 1,
    Warn = 2,
    Error = 3,
    Fatal = 4
}

export enum LogAction {
    Insert = 0,
    Update = 1,
    Delete = 2,
    Publish = 4,
    Unpublish = 5,
    AddBlackList = 6,
    TagDelete = 7,
    Appoint = 8,
    Dismiss = 9,
    Register = 10,
    UserNative = 11,
    Other = 99,
}

