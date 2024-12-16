import { PrismaClient } from '@prisma/client'
import { FastifyBaseLogger, FastifyInstance, FastifyTypeProviderDefault, RawServerDefault } from 'fastify'
import { IncomingMessage, ServerResponse } from 'http'
import Redis from 'ioredis'
import { Readable } from 'stream'
import {
  BadRequest,
  Conflict,
  Forbidden,
  InternalServerError,
  NotFound,
  PaymentRequired,
  ServiceUnavailable,
  TooManyRequests,
  Unauthorized,
  UnprocessableEntity,
} from '../plugins/error'

export type IFastify = FastifyInstance<
  RawServerDefault,
  IncomingMessage,
  ServerResponse<IncomingMessage>,
  FastifyBaseLogger,
  FastifyTypeProviderDefault
>

export type UserInterface = {
  id: string
  username: string
  email: string
  createdAt: Date
  updatedAt: Date
}

interface MulterFile {
  fieldname: string
  originalname: string
  encoding: string
  mimetype: string
  size: number
  stream: Readable
  destination: string
  filename: string
  path: string
  buffer: Buffer
}

declare module 'fastify' {
  interface FastifyInstance {
    prisma: PrismaClient
    redis: Redis
    httpErrors: {
      BadRequest: typeof BadRequest
      Unauthorized: typeof Unauthorized
      PaymentRequired: typeof PaymentRequired
      Forbidden: typeof Forbidden
      NotFound: typeof NotFound
      Conflict: typeof Conflict
      UnprocessableEntity: typeof UnprocessableEntity
      InternalServerError: typeof InternalServerError
      ServiceUnavailable: typeof ServiceUnavailable
      TooManyRequests: typeof TooManyRequests
    }
  }
  interface FastifyRequest {
    file?: MulterFile
    user?: UserInterface
  }
}
