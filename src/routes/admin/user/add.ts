import { Static, Type } from '@sinclair/typebox'
import bcrypt from 'bcrypt'
import { FastifyInstance } from 'fastify'
import { jwtMiddleware } from '../../../plugins/middleware'

const saltRounds = 10

const BodySchema = Type.Object({
  username: Type.String(),
  password: Type.String(),
})

export default async (fastify: FastifyInstance) => {
  fastify.route<{
    Body: Static<typeof BodySchema>
  }>({
    method: 'POST',
    url: '/add',
    schema: {
      body: BodySchema,
    },
    preHandler: [jwtMiddleware],
    handler: async (request, reply) => {
      const { username, password } = request.body
      const salt = await bcrypt.genSalt(saltRounds)
      const hash = await bcrypt.hash(password, salt)
      const user = await fastify.prisma.user.findUnique({
        where: { username },
      })
      if (user) throw new Error('User already exists')
      const response = await fastify.prisma.user.create({
        data: { username, password: hash },
      })
      return reply.send({
        success: true,
        data: response,
      })
    },
  })
}
