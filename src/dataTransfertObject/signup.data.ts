import { Request } from "express";

export interface signupDataFromRequest {
    firstname:string,
    lastname:string,
    email: string,
    password: string,
};

export const signupData = (req: Request): signupDataFromRequest => {
    var obj = {
        firstname:req.body.firstname,
        lastname:req.body.lastname,
        email: req.body.email,
        password: req.body.password,
    };

    return obj as signupDataFromRequest;
};