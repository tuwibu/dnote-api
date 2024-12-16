import { FastifyReply, FastifyRequest } from 'fastify'
import jwt from 'jsonwebtoken'
import _ from 'lodash'
import { Unauthorized } from './error'

const JWT_SECRET = process.env.JWT_SECRET

export const jwtMiddleware = async (request: FastifyRequest, reply: FastifyReply) => {
  try {
    const { authorization } = request.headers
    if (!authorization) throw new Unauthorized('Forbidden')
    const token = authorization.split(' ')[1]
    const check = jwt.verify(token, JWT_SECRET) as jwt.JwtPayload
    request.user = _.pick(check, ['id', 'username', 'role', 'email', 'createdAt', 'updatedAt', 'vipExpiredAt'])
  } catch (ex) {
    if (ex instanceof jwt.TokenExpiredError) throw new Unauthorized('Token expired')
    else if (ex instanceof jwt.JsonWebTokenError) throw new Unauthorized('Invalid token')
    else if (ex instanceof jwt.NotBeforeError) throw new Unauthorized('Token not active')
    else throw new Unauthorized(ex.message)
  }
}
