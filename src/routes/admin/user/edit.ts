import { Prisma } from '@prisma/client'
import { Static, Type } from '@sinclair/typebox'
import bcrypt from 'bcrypt'
import { FastifyInstance } from 'fastify'
import { jwtMiddleware } from '../../../plugins/middleware'
import { ParamSchema } from '../../../utils/datatable'

const saltRounds = 10

const BodySchema = Type.Object({
  username: Type.Optional(Type.String()),
  password: Type.Optional(Type.String()),
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
      const { username, password } = request.body
      const updateContent: Prisma.UserUpdateInput = {}
      if (request.body.hasOwnProperty('username')) updateContent.username = username
      if (request.body.hasOwnProperty('password')) {
        const salt = await bcrypt.genSalt(saltRounds)
        const hash = await bcrypt.hash(password, salt)
        updateContent.password = hash
      }
      const response = await fastify.prisma.user.update({
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
