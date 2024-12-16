import { Static, Type } from '@sinclair/typebox'
import { FastifyInstance } from 'fastify'

export const ParamSchema = Type.Object({
  slug: Type.String(),
})

export const BodySchema = Type.Object({
  password: Type.Optional(Type.String()),
})

export default async (fastify: FastifyInstance) => {
  fastify.route<{
    Params: Static<typeof ParamSchema>
    Body: Static<typeof BodySchema>
  }>({
    method: 'POST',
    url: '/:slug',
    schema: {
      params: ParamSchema,
      body: BodySchema,
    },
    handler: async (request, reply) => {
      const { slug } = request.params
      const { password } = request.body
      const note = await fastify.prisma.note.findFirst({
        where: {
          slug
        },
      })
      if (!note) throw new fastify.httpErrors.NotFound('Note not found')
      if (note.private) throw new fastify.httpErrors.Forbidden('Note is private')
      if (note.password) {
        if (!password) throw new fastify.httpErrors.Unauthorized('Password is required')
        if (note.password !== password) throw new fastify.httpErrors.Unauthorized('Incorrect password')
      }
      return reply.send({
        success: true,
        data: note,
      })
    },
  })
}
