import { Request, Response } from 'express'
import { ObjectId } from 'mongodb'
import { ROLE } from '~/constants/enum'
import HTTP_STATUS from '~/constants/httpStatus'
import { USERS_MESSAGES } from '~/constants/messages'
import authService from '~/services/auth.services'
import databaseService from '~/services/database.services'

export const createAccountController = async (req: Request, res: Response) => {
  const payload = req.body
  const data = await authService.createAccount(payload)
  return res.json({
    message: USERS_MESSAGES.CREATE_ACCOUNT_SUCCESS,
    data
  })
}

export const updateRoleAccountController = async (req: Request, res: Response) => {
  const { user_id } = req.params
  const { roles } = req.body

  const user = await databaseService.users.findOne({ _id: new ObjectId(user_id) })
  if (!user) {
    return res.status(HTTP_STATUS.NOT_FOUND).json({
      message: USERS_MESSAGES.ACCOUNT_NOT_FOUND
    })
  }

  if (user.roles === roles) {
    return res.json({
      message: `Account is already a ${ROLE[user.roles]}`
    })
  }

  const data = await authService.updateRoleAccount(user_id, roles)
  return res.json({
    message: USERS_MESSAGES.UPDATE_ROLE_SUCCESS,
    data
  })
}

export const getAccountByRolesController = async (req: Request, res: Response) => {
  const data = await authService.getAccountByRole(Number(req.query.roles))
  return res.json({
    message: USERS_MESSAGES.GET_ACCOUNT_BY_ROLE_SUCCESS,
    data
  })
}

export const getAllAccountController = async (req: Request, res: Response) => {
  const limit = Number(req.query.limit)
  const page = Number(req.query.page)

  const data = await authService.getAllAccount({ limit, page })
  return res.json({
    message: USERS_MESSAGES.GET_ALL_ACCOUNT_SUCCESS,
    data: {
      products: data.result,
      limit,
      page,
      total_page: Math.ceil(data.total / limit),
      total_account: data.total
    }
  })
}
