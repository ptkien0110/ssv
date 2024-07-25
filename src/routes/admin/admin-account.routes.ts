import { Router } from 'express'
import {
  createAccountController,
  getAccountByRolesController,
  getAllAccountController,
  updateRoleAccountController
} from '~/controllers/account.controller'
import {
  accessTokenValidator,
  createAccountValidator,
  rolesValidator,
  userIdValidator,
  verifiedAdminValidator
} from '~/middlewares/auth.middleware'
import { wrapRequestHandler } from '~/utils/handler'

const adminAccountRouter = Router()

adminAccountRouter.post(
  '/create',
  accessTokenValidator,
  verifiedAdminValidator,
  createAccountValidator,
  wrapRequestHandler(createAccountController)
)

adminAccountRouter.post(
  '/update-roles/:user_id',
  accessTokenValidator,
  verifiedAdminValidator,
  userIdValidator,
  rolesValidator,
  wrapRequestHandler(updateRoleAccountController)
)

adminAccountRouter.get(
  '/get-role',
  accessTokenValidator,
  verifiedAdminValidator,
  rolesValidator,
  wrapRequestHandler(getAccountByRolesController)
)

adminAccountRouter.get(
  '/get-all-account',
  accessTokenValidator,
  verifiedAdminValidator,
  wrapRequestHandler(getAllAccountController)
)

export default adminAccountRouter
