import { Request } from "express";

export interface signinDataFromRequest {
    email: string,
    password: string,
};

export const signinData = (req: Request): signinDataFromRequest => {
    var obj = {
        email: req.body.email,
        password: req.body.password,
    };

    return obj as signinDataFromRequest;
};