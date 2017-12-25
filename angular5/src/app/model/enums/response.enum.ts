
export enum ServerStatus {
    Succeed = 0,

    Error = 10000,
    DeleteNotAllowed = 10001,
    BodyFormIsNull = 10002,
    QueryParamsNull = 10003,

    BearerCheckFailed = 20001,
    LoginFailed = 20002,
    RegisterFailed = 20003,
    UserNotFound = 20004,
    UserExist = 20005,
    UserNotLogin = 20006,
    UserNotMatched = 20007,
    UserUpdateFailed = 20008,
    ThirdPartUserNotExist = 20009,
    UserAccessDenied = 20010,
    CheckAdminFailed = 20011,

    WeiboAccessFailed = 21001,
    WeiboInfosFetchFailed = 21002,
    WeiboUserCheckFailed = 21003,
    WeiboDetailsNotFound = 21004,
    WeiboRevokeFailed = 21005,
    WeiboRevokeException = 21006,

    InsertEntryFailed = 30001,

    StatusCollectionLoadFailed = 40001,
    StatusInsertFailed = 40002,
    StatusNotFound = 40003,

    CommentAddFailed = 50001,
    CommentRemoveFailed = 50002,
    LikesAddFailed = 51101,
    LikesRemoveFailed = 51102,
}

