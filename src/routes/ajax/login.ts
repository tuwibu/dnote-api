import { Static, Type } from '@sinclair/typebox'
import bcrypt from 'bcrypt'
import { FastifyInstance } from 'fastify'
import jwt from 'jsonwebtoken'
import _ from 'lodash'

const JWT_SECRET = process.env.JWT_SECRET

export const BodySchema = Type.Object({
  username: Type.String(),
  password: Type.String(),
})

export default async (fastify: FastifyInstance) => {
  fastify.route<{
    Body: Static<typeof BodySchema>
  }>({
    method: 'POST',
    url: '/login',
    schema: {
      body: BodySchema,
    },
    handler: async (request, reply) => {
      const { username, password } = request.body
      const user = await fastify.prisma.user.findFirst({
        where: {
          username
        },
      })
      if (!user) throw new fastify.httpErrors.Unauthorized('Incorrect username and password')
      const verify = await bcrypt.compare(password, user.password)
      if (!verify) throw new fastify.httpErrors.Unauthorized('Incorrect username and password')
      const body = _.pick(user, ['id', 'username', 'createdAt', 'updatedAt'])
      const token = jwt.sign(body, JWT_SECRET, {
        expiresIn: '30d',
      })
      return reply.send({
        success: true,
        data: {
          ...body,
          accessToken: token,
        },
      })
    },
  })
}
