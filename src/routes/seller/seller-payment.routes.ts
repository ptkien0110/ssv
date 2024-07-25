import { Router } from 'express'
import { getAllCostBearerController, getAllPaymentMethodController } from '~/controllers/payment.controller'
import { accessTokenValidator, verifiedAdminValidator, verifiedSellerValidator } from '~/middlewares/auth.middleware'
import { wrapRequestHandler } from '~/utils/handler'

const sellerPaymentRouter = Router()

sellerPaymentRouter.get(
  '/get-all-payment-method',
  accessTokenValidator,
  verifiedSellerValidator,
  wrapRequestHandler(getAllPaymentMethodController)
)

sellerPaymentRouter.get(
  '/get-all-cost-bearer',
  accessTokenValidator,
  verifiedSellerValidator,
  wrapRequestHandler(getAllCostBearerController)
)
export default sellerPaymentRouter
