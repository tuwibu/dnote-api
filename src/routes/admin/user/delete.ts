import { Static } from '@sinclair/typebox'
import { FastifyInstance } from 'fastify'
import { jwtMiddleware } from '../../../plugins/middleware'
import { ParamSchema } from '../../../utils/datatable'

export default async (fastify: FastifyInstance) => {
  fastify.route<{
    Params: Static<typeof ParamSchema>
  }>({
    method: 'POST',
    url: '/delete/:id',
    schema: {
      params: ParamSchema,
    },
    preHandler: [jwtMiddleware],
    handler: async (request, reply) => {
      const { id } = request.params
      await fastify.prisma.user.delete({ where: { id } })
      return reply.send({
        success: true,
      })
    },
  })
}
