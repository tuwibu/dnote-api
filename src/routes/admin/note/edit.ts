import { Prisma } from '@prisma/client'
import { Static, Type } from '@sinclair/typebox'
import { FastifyInstance } from 'fastify'
import { jwtMiddleware } from '../../../plugins/middleware'
import { ParamSchema } from '../../../utils/datatable'

const BodySchema = Type.Object({
  name: Type.Optional(Type.String()),
  slug: Type.Optional(Type.String()),
  content: Type.Optional(Type.String()),
  password: Type.Optional(Type.String()),
  private: Type.Optional(Type.Boolean()),
})

export default async (fastify: FastifyInstance) => {
  fastify.route<{
    Params: Static<typeof ParamSchema>
    Body: Static<typeof BodySchema>
  }>({
    method: 'POST',
    url: '/edit/:id',
    schema: {
      params: ParamSchema,
      body: BodySchema,
    },
    preHandler: [jwtMiddleware],
    handler: async (request, reply) => {
      const { id } = request.params
      const { name, slug, content, password } = request.body
      const updateContent: Prisma.NoteUpdateInput = {}
      if (request.body.hasOwnProperty('name')) updateContent.name = name
      if (request.body.hasOwnProperty('slug')) updateContent.slug = slug
      if (request.body.hasOwnProperty('content')) updateContent.content = content
      if (request.body.hasOwnProperty('password')) updateContent.password = password
      if (request.body.hasOwnProperty('private')) updateContent.private = request.body.private
      const response = await fastify.prisma.note.update({
        where: { id },
        data: updateContent,
      })
      return reply.send({
        success: true,
        data: response,
      })
    },
  })
}
