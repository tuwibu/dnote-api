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
      const response: any = await fastify.prisma.user.findMany({
        where: query.where,
        orderBy: query.orderBy,
        skip: query.skip,
        take: query.take,
        select: {
          id: true,
          username: true,
          createdAt: true,
          updatedAt: true,
        },
      })
      const total = await fastify.prisma.user.count({
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
