import { Request } from "express";

export interface refreshTokenDataFromRequest {
    refresh_token: string,
};


export const refreshTokenData = (req: Request): refreshTokenDataFromRequest => {
    var obj = {
        refresh_token: req.body.refresh_token,
    };

    return obj as refreshTokenDataFromRequest;
};