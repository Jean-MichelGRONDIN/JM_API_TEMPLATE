import { Knex } from 'knex'
import { signinDataFromRequest } from '../../dataTransfertObject/signin.data'
import { RefreshToken } from '../../action/auth.action'
import { signupDataFromRequest } from '../../dataTransfertObject/signup.data'
import knex from '../database'

const IsUserExitSQL = `
SELECT EXISTS(
    SELECT * FROM users
    WHERE email = crypt(?, email)
);
`

export const knexIsUserExit = (email: string): Knex.Raw<any> => {
    return knex.raw(IsUserExitSQL, [email])
}

const SingnupSQL = `
INSERT INTO users (firstname, lastname, email, password)
VALUES (crypt(?, gen_salt('bf')), crypt(?, gen_salt('bf')), crypt(?, gen_salt('bf')), crypt(?, gen_salt('bf')))
RETURNING id, firstname, lastname, email;
`

export const knexSignup = (payload: signupDataFromRequest): Knex.Raw<any> => {
    return knex.raw(SingnupSQL, [payload.firstname, payload.lastname, payload.email, payload.password])
}

const StoreRefreshTokenSQL = `
INSERT INTO refresh_token (ip, user_agent, token, expiron, user_id)
VALUES (?, ?, ?, ?, ?);
`

export const knexStoreRefreshToken = (payload: RefreshToken): Knex.Raw<any> => {
    return knex.raw(StoreRefreshTokenSQL, [payload.ip, payload.user_agent, payload.token, payload.expiron, payload.user_id])
}

const FindUserByPasswordAndEmailSQL = `
SELECT id, email FROM users
WHERE email = crypt(?, email)
AND password = crypt(?, password)
AND deleted_at IS NULL;
`

export const knexfindUserByPasswordAndEmail = (payload: signinDataFromRequest): Knex.Raw<any> => {
    return knex.raw(FindUserByPasswordAndEmailSQL, [payload.email, payload.password])
}

const GetRefreshTokenByToken = `
SELECT user_id, token FROM refresh_token
WHERE token = ?
AND deleted_at IS NULL;
`

export const knexGetRefreshTokenByToken = (token: string): Knex.Raw<any> => {
    return knex.raw(GetRefreshTokenByToken, [token])
}

const DeleteRefreshTokenByToken = `
UPDATE refresh_token
SET deleted_at = NOW()
WHERE token = ?
AND deleted_at IS NULL;
`

export const knexDeleteRefreshTokenByToken = (token: string): Knex.Raw<any> => {
    return knex.raw(DeleteRefreshTokenByToken, [token])
}