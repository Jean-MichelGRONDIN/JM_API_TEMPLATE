import { Request, Response } from "express";
import API_APPINESS from '../config/config';
import jwt from 'jsonwebtoken'

export let authorization = (req: Request, res: Response) => {
    let token : string = jwt.sign({}, API_APPINESS.API.getInstance().Security.OAuthSecret, { expiresIn: '2h' });

    res.status(200).send({
        "message": "ok",
        "data": {
           "auth_token": token,
           "token_type": "Bearer",
           "expire_in": "7200"
        }
    });
  }