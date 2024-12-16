import autoload from '@fastify/autoload'
import cors from '@fastify/cors'
import fastifyStatic from '@fastify/static'
import multer from 'fastify-multer'
import dotenv from 'dotenv'
import fastify from 'fastify'
import path from 'path'
import errorPlugin from './plugins/error'
import prismaPlugin from './plugins/prisma'
import { Prisma } from '@prisma/client'

dotenv.config()
const app = fastify({
  logger: false,
})
app.register(prismaPlugin)
app.register(errorPlugin)
// middleware
app.register(cors)
app.register(multer.contentParser)
app.register(fastifyStatic, {
  root: path.resolve(__dirname, '../public'),
  prefix: '/public/',
})
// handle error
app.setNotFoundHandler((request, reply) => {
  reply.status(404).send({
    success: false,
    message: `Route ${request.method}:${request.url} not found`,
  })
})
app.setErrorHandler((error, request, reply) => {
  // console.error(error)
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    // https://www.prisma.io/docs/orm/reference/error-reference
    switch (error.code) {
      case 'P1000':
        return reply.status(400).send({
          success: false,
          message: 'Authentication failed',
        })
      case 'P1001':
        return reply.status(400).send({
          success: false,
          message: "Can't reach database",
        })
      case 'P1002':
        return reply.status(400).send({
          success: false,
          message: 'The database server was reached but timed out',
        })
      case 'P1008':
        return reply.status(400).send({
          success: false,
          message: 'Operations timed out',
        })
      case 'P1017':
        return reply.status(400).send({
          success: false,
          message: 'Server has closed the connection',
        })
      case 'P2002':
        return reply.status(400).send({
          success: false,
          message: `Unique constraint failed on the fields (${Object.values(error.meta.target).join(', ')})`,
        })
      case 'P2025':
        return reply.status(400).send({
          success: false,
          message: `Foreign key constraint failed on the fields (${Object.values(error.meta.target).join(', ')})`,
        })
      default:
        break
    }
  }
  return reply.status(error?.statusCode || 500).send({
    success: false,
    message: error.message,
  })
})
app.register(autoload, {
  dir: path.resolve(__dirname, 'routes'),
  dirNameRoutePrefix: true,
  routeParams: true,
})
app.get('/', async (request, reply) => {
  reply.send({
    copyright: `© ${new Date().getFullYear()} VoiceTube`,
  })
})

app.listen(
  {
    port: parseInt(process.env.PORT || '5000'),
    host: '0.0.0.0',
  },
  async (err, address) => {
    if (err) {
      console.error(err)
      process.exit(1)
    }
    console.log(`Server listening at ${address}`)
  },
)
