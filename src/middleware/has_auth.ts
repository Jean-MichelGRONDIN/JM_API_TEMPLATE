import { Request, Response } from "express";
import API_APPINESS from '../config/config';
import jwt from 'jsonwebtoken'

export let hasAuth = (req: Request, res: Response, next: any): void => {
    let bearerToken = req.headers.authorization;
    if (!bearerToken || bearerToken === "") {
        res.status(403).send({status:403, message: "Forbidden", data: null});
        return;
    }

    let token = bearerToken.split(' ')[1];
    if (!token || token === "") {
        res.status(403).send({status:403, message: "Forbidden", data: null});
        return;
    }

    jwt.verify(token, API_APPINESS.API.getInstance().Security.OAuthSecret, (err: jwt.VerifyErrors | null, decoded: jwt.JwtPayload | undefined) => {
        if (err || !decoded)
            return res.status(403).send({status:403, message: "Forbidden", data: null});
        else {
            if (decoded.exp) {
                next();
            }
        }
    })
    return
}