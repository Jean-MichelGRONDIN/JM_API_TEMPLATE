import { signupDataFromRequest } from "../dataTransfertObject/signup.data"
import { knexDeleteRefreshTokenByToken, knexfindUserByPasswordAndEmail, knexGetRefreshTokenByToken, knexIsUserExit, knexSignup, knexStoreRefreshToken } from "../database/queries/auth.queries"
import { signinDataFromRequest } from "../dataTransfertObject/signin.data"
import { ErrorDB } from "../database/errors"

export const isUserExit = (email: string): Promise<boolean | ErrorDB> => {
    return knexIsUserExit(email).then((res) => {
        if (res.rows[0].exists) {
            return true
        }
        return false
    }).catch((error: Error) => {
        return new ErrorDB(error, "IS_USER_EXIST")
    })
}

export interface SignupOutput {
    id: string,
    firstname:string,
    lastname:string,
    email: string,
    password: string,
}

export const signup = (payload: signupDataFromRequest): Promise<SignupOutput | ErrorDB | null> => {
    return  knexSignup(payload).then((res) => {
        if (res.rowCount <= 0) {
            return null
        }
        return res.rows[0] as SignupOutput
    }).catch((error: Error) => {
        return new ErrorDB(error, "CREATE_USER")
    })
}

export interface RefreshToken {
    ip: string,
    user_agent: string,
    token: string,
    expiron: string,
    user_id: string,
}

export const storeRefreshToken = (payload: RefreshToken): Promise<null | ErrorDB> => {
    return knexStoreRefreshToken(payload).then(() => {
        return null
    }).catch((error: Error) => {
        return new ErrorDB(error, "STORE_REFRESH_TOKEN")
    })
}

export interface UserFound {
    id: string,
    email: string,
}

export const findUserByPasswordAndEmail = (payload: signinDataFromRequest): Promise<ErrorDB | UserFound | null> => {
    return knexfindUserByPasswordAndEmail(payload).then((res) => {
        if (res.rowCount <= 0) {
            return null
        }
        return res.rows[0] as UserFound
    }).catch((error: Error) => {
        return new ErrorDB(error, "FIND_USER")
    })
}

export interface RefreshTokenOutput {
    user_id: string,
    token: string,
}

export const getRefreshTokenByToken = (token: string): Promise<RefreshTokenOutput | ErrorDB | null> => {
    return knexGetRefreshTokenByToken(token).then((res) => {
        if (res.rowCount <= 0) {
            return null
        }
        return res.rows[0] as RefreshTokenOutput
    }).catch((error: Error) => {
        return new ErrorDB(error, "GET_REFRESH_TOKEN")
    })
}

export const deleteRefreshTokenByToken = (token: string): Promise<ErrorDB | null> => {
    return knexDeleteRefreshTokenByToken(token).then(() => {
        return null
    }).catch((error: Error) => {
        return new ErrorDB(error, "GET_REFRESH_TOKEN")
    })
}