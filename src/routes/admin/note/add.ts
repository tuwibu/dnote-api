import { Static, Type } from '@sinclair/typebox'
import { FastifyInstance } from 'fastify'
import { jwtMiddleware } from '../../../plugins/middleware'
import { convertSlug } from '../../../utils'

const BodySchema = Type.Object({
  name: Type.String(),
  slug: Type.Optional(Type.String()),
  content: Type.String(),
  password: Type.Optional(Type.String()),
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
      const { name, slug, content, password } = request.body
      const response = await fastify.prisma.note.create({
        data: {
          name,
          slug: slug || convertSlug(name),
          content,
          password,
        },
      })
      return reply.send({
        success: true,
        data: response,
      })
    },
  })
}
