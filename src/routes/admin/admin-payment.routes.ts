import { Router } from 'express'
import {
  createCostBearerController,
  createPaymentMethodController,
  getAllCostBearerController,
  getAllPaymentMethodController
} from '~/controllers/payment.controller'
import { accessTokenValidator, verifiedAdminValidator } from '~/middlewares/auth.middleware'
import { wrapRequestHandler } from '~/utils/handler'

const adminPaymentRouter = Router()

adminPaymentRouter.post(
  '/create-payment-method',
  accessTokenValidator,
  verifiedAdminValidator,
  wrapRequestHandler(createPaymentMethodController)
)

adminPaymentRouter.get(
  '/get-all-payment-method',
  accessTokenValidator,
  verifiedAdminValidator,
  wrapRequestHandler(getAllPaymentMethodController)
)

adminPaymentRouter.post(
  '/create-cost-bearer',
  accessTokenValidator,
  verifiedAdminValidator,
  wrapRequestHandler(createCostBearerController)
)

adminPaymentRouter.get(
  '/get-all-cost-bearer',
  accessTokenValidator,
  verifiedAdminValidator,
  wrapRequestHandler(getAllCostBearerController)
)
export default adminPaymentRouter
