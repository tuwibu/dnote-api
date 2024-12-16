import { Static } from '@sinclair/typebox'
import { FastifyInstance } from 'fastify'
import { jwtMiddleware } from '../../../plugins/middleware'
import { AjaxSchema, genQuery } from '../../../utils/datatable'

export default async (fastify: FastifyInstance) => {
  fastify.route<{
    Body: Static<typeof AjaxSchema>
  }>({
    method: 'POST',
    url: '/ajax',
    schema: {
      body: AjaxSchema,
    },
    preHandler: [jwtMiddleware],
    handler: async (request, reply) => {
      const query = genQuery(request.body)
      const response = await fastify.prisma.note.findMany({
        where: query.where,
        orderBy: query.orderBy,
        skip: query.skip,
        take: query.take,
        include: {
          Histories: true,
        }
      })
      const total = await fastify.prisma.note.count({
        where: query.where,
      })
      return reply.send({
        success: true,
        data: response,
        recordsTotal: total,
        recordsFiltered: total,
        pages: Math.ceil(total / query.take),
      })
    },
  })
}
