import { Router } from 'express'
import { statisticRevenuesByProviderController, statisticRevenuesController } from '~/controllers/statistic.controller'
import {
  accessTokenValidator,
  userIdValidator,
  verifiedProviderValidator,
  verifiedSellerValidator
} from '~/middlewares/auth.middleware'
import { wrapRequestHandler } from '~/utils/handler'

const sellerStatisticRouter = Router()

sellerStatisticRouter.post(
  '/statistic-revenues',
  accessTokenValidator,
  verifiedSellerValidator,
  wrapRequestHandler(statisticRevenuesController)
)
export default sellerStatisticRouter
