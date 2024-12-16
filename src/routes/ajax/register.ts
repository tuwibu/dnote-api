import { Static, Type } from '@sinclair/typebox'
import bcrypt from 'bcrypt'
import { FastifyInstance } from 'fastify'

const saltRounds = 10

export const BodySchema = Type.Object({
  username: Type.String(),
  password: Type.String(),
})

export default async (fastify: FastifyInstance) => {
  fastify.route<{
    Body: Static<typeof BodySchema>
  }>({
    method: 'POST',
    url: '/register',
    schema: {
      body: BodySchema,
    },
    handler: async (request, reply) => {
      const { username, password } = request.body
      const check = await fastify.prisma.user.count()
      if (check > 0) throw new fastify.httpErrors.Forbidden('Permission denied')
      const salt = await bcrypt.genSalt(saltRounds)
      const hash = await bcrypt.hash(password, salt)
      await fastify.prisma.user.create({
        data: { username, password: hash },
      })
      return reply.send({
        success: true,
      })
    },
  })
}
