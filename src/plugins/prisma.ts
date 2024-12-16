import { PrismaClient } from '@prisma/client'
import fastifyPlugin from 'fastify-plugin'

export default fastifyPlugin(async (server, options) => {
  const prisma = new PrismaClient({
    // log: ['query', 'info', 'warn', 'error']
  })
  await prisma.$connect()

  server.decorate('prisma', prisma)
})
