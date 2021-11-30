import { Request } from "express";
import API_APPINESS from '../config/config';
import jwt from 'jsonwebtoken'

export interface User {
    user_id: string
}

export let getCurrentUser = (req: Request): User | null => {
    let jwtToken = req.headers['jwttoken'] as string | undefined;
    if (!jwtToken || jwtToken === "") {
        return null
    }


    let token = jwtToken.split(' ')[1];
    let user: User = {user_id: ""};
    jwt.verify(token, API_APPINESS.API.getInstance().Security.Secret, (err: jwt.VerifyErrors | null, decoded: jwt.JwtPayload | undefined) => {
        if (err || !decoded)
            return
        user.user_id = decoded.id as string
    })
    return user
}