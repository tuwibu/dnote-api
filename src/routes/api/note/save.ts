import { Static, Type } from '@sinclair/typebox'
import { FastifyInstance } from 'fastify'

export const ParamSchema = Type.Object({
  slug: Type.String(),
})

export const BodySchema = Type.Object({
  password: Type.Optional(Type.String()),
  content: Type.String(),
})

export default async (fastify: FastifyInstance) => {
  fastify.route<{
    Params: Static<typeof ParamSchema>
    Body: Static<typeof BodySchema>
  }>({
    method: 'PUT',
    url: '/:slug',
    schema: {
      params: ParamSchema,
      body: BodySchema,
    },
    handler: async (request, reply) => {
      const { slug } = request.params
      const { password, content } = request.body
      await fastify.prisma.note.upsert({
        where: {
          slug
        },
        update: {
          content,
          password,
        },
        create: {
          slug,
          name: slug,
          content,
          password,
        },
      })
      return reply.send({
        success: true,
      })
    },
  })
}
