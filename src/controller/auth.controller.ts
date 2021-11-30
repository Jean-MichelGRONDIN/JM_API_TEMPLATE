import { Request, Response } from "express";
import API_APPINESS from '../config/config';
import jwt  from 'jsonwebtoken' ;
import { signupData, signupDataFromRequest } from "../dataTransfertObject/signup.data";
import { deleteRefreshTokenByToken, findUserByPasswordAndEmail, getRefreshTokenByToken, isUserExit, signup, SignupOutput, storeRefreshToken, UserFound } from "../action/auth.action";
import { signinData } from "../dataTransfertObject/signin.data";
import { refreshTokenData } from "../dataTransfertObject/refresh-token.data";
import { ErrorDB } from "../database/errors";
import { getCurrentUser } from "../utils/get_current_user";

export let signupController = async (req: Request, res: Response) => {
    let data: signupDataFromRequest = signupData(req);

    let isUsr: (boolean | ErrorDB) = await isUserExit(data.email);
    if (isUsr instanceof ErrorDB) {
        res.status(500).send({message: "ko", data: {isUsr}})
        return
    } else if (isUsr) {
        res.status(400).send({message: "ko", data: {error: "user already exist."}})
        return
    }

    let refresh_token: string;
    let access_token: string;

    let user: ErrorDB | SignupOutput | null = await signup(data); 
    if (user instanceof ErrorDB) {
        res.status(500).send({message: "ko", data: {user}})
        return
    } else if (user === null) {
        res.status(500).send({message: "ko", data: {"error": "the user's payload returned by the server is empty", "code": "USER_EMPTY"}})
        return
    }

    access_token = jwt.sign({id: user.id}, API_APPINESS.API.getInstance().Security.Secret, { expiresIn: ((60 * 60) * 24) * API_APPINESS.API.getInstance().Security.AccessTokenDuration });
    refresh_token = jwt.sign({}, API_APPINESS.API.getInstance().Security.Secret, { expiresIn: ((60 * 60) * 24) * API_APPINESS.API.getInstance().Security.RefreshTokenDuration });
    
    let exp: (string | number | Date) = new Date();
    exp.setHours((24 * API_APPINESS.API.getInstance().Security.RefreshTokenDuration))

    const payload = {
        ip: req.ip,
        token: refresh_token,
        user_agent: req.headers["user-agent"] ? req.headers["user-agent"] : "",
        user_id: user.id,
        expiron: exp.toISOString()
    }

    let err: ErrorDB | null = await storeRefreshToken(payload);
    if (err !== null) {
        res.status(500).send({message: "ko", data: {err}})
        return
    }

    res.status(200).send({
        "message": "ok",
        "data": {
            "access_token": access_token,
            "refresh_token": refresh_token
        }
    })
}

export let signinController = async (req: Request, res: Response) => {
    const data = signinData(req);

    let user: (ErrorDB | UserFound | null) = await findUserByPasswordAndEmail(data);
    if (user instanceof ErrorDB) {
        res.status(500).send({message: "ko", data: {user}})
        return
    } else if (user === null) {
        res.status(500).send({message: "ko", data: {"error": "the user's payload returned by the server is empty", "code": "USER_EMPTY_FOUND"}})
        return
    }

    let refresh_token: string;
    let access_token: string;
    access_token = jwt.sign({id: user.id}, API_APPINESS.API.getInstance().Security.Secret, { expiresIn: ((60 * 60) * 24) * API_APPINESS.API.getInstance().Security.AccessTokenDuration });
    refresh_token = jwt.sign({}, API_APPINESS.API.getInstance().Security.Secret, { expiresIn: ((60 * 60) * 24) * API_APPINESS.API.getInstance().Security.RefreshTokenDuration });
    
    let exp: (string | number | Date) = new Date();
    exp.setHours((24 * API_APPINESS.API.getInstance().Security.RefreshTokenDuration))
    
    const payload = {
        ip: req.ip,
        token: refresh_token,
        user_agent: req.headers["user-agent"] ? req.headers["user-agent"] : "",
        user_id: user.id,
        expiron: exp.toISOString()
    }

    let err: ErrorDB | null = await storeRefreshToken(payload);
    if (err !== null) {
        res.status(500).send({message: "ko", data: {err}})
        return
    }

    res.status(200).send({
        "message": "ok",
        "data": {
            "access_token": access_token,
            "refresh_token": refresh_token
        }
    })
}

export const refresh = async (req: Request, res: Response) => {
    const data = refreshTokenData(req)

    let isValid: boolean = false;

    jwt.verify(data.refresh_token, API_APPINESS.API.getInstance().Security.Secret, (err: jwt.VerifyErrors | null, decoded: jwt.JwtPayload | undefined) => {
        if (err || !decoded) {
            isValid = false
        } else {
            isValid = true
        }
    })
    if (!isValid) {
        res.status(400).send({message: "ko", data: {"code": "VALIDATE_REFRESH_TOKEN"}});
        return
    }

    let isExist = await getRefreshTokenByToken(data.refresh_token);
    if (isExist instanceof ErrorDB) {
        res.status(500).send({message: "ko", data: {isExist}})
        return
    } else if (isExist === null) {
        res.status(500).send({message: "ko", data: {"error": "the payload returned by the server is empty", "code": "TOKEN_EMPTY"}})
        return
    }

    let refresh_token: string;
    let access_token: string;
    access_token = jwt.sign({id: isExist.user_id}, API_APPINESS.API.getInstance().Security.Secret, { expiresIn: ((60 * 60) * 24) * API_APPINESS.API.getInstance().Security.AccessTokenDuration });
    refresh_token = jwt.sign({}, API_APPINESS.API.getInstance().Security.Secret, { expiresIn: ((60 * 60) * 24) * API_APPINESS.API.getInstance().Security.RefreshTokenDuration });
    
    let exp: (string | number | Date) = new Date();
    exp.setHours((24 * API_APPINESS.API.getInstance().Security.RefreshTokenDuration))
    
    const payload = {
        ip: req.ip,
        token: refresh_token,
        user_agent: req.headers["user-agent"] ? req.headers["user-agent"] : "",
        user_id: isExist.user_id,
        expiron: exp.toISOString()
    }

    let err: ErrorDB | null = await storeRefreshToken(payload);
    if (err !== null) {
        res.status(500).send({message: "ko", data: {err}})
        return
    }

    let deleteToken = deleteRefreshTokenByToken(data.refresh_token)
    if (deleteToken instanceof ErrorDB) {
        res.status(500).send({message: "ko", data: {deleteToken}})
        return
    }

    res.status(200).send({
        "message": "ok",
        "data": {
            "access_token": access_token,
            "refresh_token": refresh_token
        }
    })

}

export const getCurrentUserController = (req: Request, res: Response) => {
    const user = getCurrentUser(req)

    res.status(200).send({user: user})
}