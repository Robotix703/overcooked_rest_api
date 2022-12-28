export interface IUpdateOne {
    n: number;
    modifiedCount: number;
    ok: number;
}

export interface IDeleteOne {
    n: number;
    deletedCount: number;
    ok: number;
}

export interface ISave {
    err: Error
}