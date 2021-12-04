import { Request, Response } from "express";
import { IUser, User as UserAlias } from "../utils/user";
import API_APPINESS from '../config/config';
import jwt from 'jsonwebtoken';
import axios from "axios";

export interface User {
    user_id: string
}

export let doesCurrentUserExist = async (req: Request, res: Response, next: any) => {
    let jwtToken = req.headers['jwttoken'] as string | undefined;
    if (!jwtToken || jwtToken === "") {
        return null
    }


    let token = jwtToken.split(' ')[1];
    let user: User = {user_id: ""};
    jwt.verify(token, API_APPINESS.API.getInstance().Security.Secret, (err: jwt.VerifyErrors | null, decoded: jwt.JwtPayload | undefined) => {
        if (err || !decoded)
            res.status(403).send({status:403, message: "Forbidden", data: null});
        user.user_id = decoded.id as string
    })
    UserAlias.CreateInstance(user as IUser)
    next();
}
