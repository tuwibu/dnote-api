import { Type } from '@sinclair/typebox'

// param id
export const ParamSchema = Type.Object({
  id: Type.String({
    format: 'uuid',
  }),
})

// body datatable
enum AjaxOrder {
  Asc = 'ascend',
  Desc = 'descend',
}

export const AjaxSchema = Type.Object({
  pageSize: Type.Number({
    default: 10,
  }),
  current: Type.Number({
    default: 1,
  }),
  searchColumn: Type.Array(Type.String()),
  search: Type.Optional(
    Type.Object(
      {},
      {
        additionalProperties: true,
      },
    ),
  ),
  field: Type.Optional(Type.String()),
  order: Type.Optional(
    Type.Enum(AjaxOrder, {
      default: AjaxOrder.Desc,
    }),
  ),
})

// generate query for prisma
export const genQuery = (body: {
  pageSize: number
  current: number
  searchColumn: any
  search?: any
  field?: string
  order?: 'ascend' | 'descend'
}) => {
  const { pageSize, current, searchColumn, search, field, order } = body
  const where: {
    [key: string]: any
  } = {}
  const orderBy: {
    [key: string]: any
  } = {}
  // Tạo đối tượng search
  if (search) {
    Object.keys(search).forEach((key) => {
      if (key == 'keyword') {
        const value = search[key].trim()
        const OR: {
          [key: string]: any
        }[] = []
        if (value) {
          Object.keys(searchColumn).forEach((key) => {
            OR.push({
              [searchColumn[key]]: {
                contains: value,
                mode: 'insensitive',
              },
            })
          })
        }
        if (OR.length > 0) {
          where.OR = OR
        }
      } else if (key == 'date') {
        const { from, to } = search[key]
        if (from && to) {
          where.date = {
            gte: new Date(from),
            lte: new Date(to),
          }
        }
      } else {
        const value = search[key]
        if (value != null) {
          if (Array.isArray(value)) {
            if (typeof value[0] == 'string' || typeof value[0] == 'number') {
              if (key == 'tags') {
                where[key] = {
                  hasEvery: value,
                }
              } else {
                where[key] = {
                  in: value,
                }
              }
            } else if (typeof value[0] == 'boolean') {
              if (value.length == 1) {
                where[key] = value[0]
              }
            }
          } else {
            where[key] = value
          }
        }
      }
    })
  }
  // Tạo đối tượng orderBy
  if (field && order) {
    orderBy[field] = order.replace('end', '')
  }
  return {
    take: pageSize,
    skip: (current - 1) * pageSize,
    where,
    orderBy,
  }
}

export default genQuery
