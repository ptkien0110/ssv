import { Router } from 'express'
import {
  adminStatisticRevenuesByProviderController,
  adminStatisticRevenuesBySellerController,
  adminStatisticRevenuesInviteBySellerController,
  adminStatisticRevenuesInviteController,
  statisticRevenuesController
} from '~/controllers/statistic.controller'
import { accessTokenValidator, userIdValidator, verifiedAdminValidator } from '~/middlewares/auth.middleware'
import { wrapRequestHandler } from '~/utils/handler'

const adminStatisticRouter = Router()

adminStatisticRouter.post(
  '/statistic-revenues',
  accessTokenValidator,
  verifiedAdminValidator,
  wrapRequestHandler(statisticRevenuesController)
)

adminStatisticRouter.post(
  '/statistic-revenues-by-pdp',
  accessTokenValidator,
  verifiedAdminValidator,
  userIdValidator,
  wrapRequestHandler(adminStatisticRevenuesByProviderController)
)

adminStatisticRouter.post(
  '/statistic-revenues-by-seller',
  accessTokenValidator,
  verifiedAdminValidator,
  userIdValidator,
  wrapRequestHandler(adminStatisticRevenuesBySellerController)
)

adminStatisticRouter.post(
  '/statistic-revenues-invite',
  accessTokenValidator,
  verifiedAdminValidator,
  wrapRequestHandler(adminStatisticRevenuesInviteController)
)

adminStatisticRouter.post(
  '/statistic-revenues-invite-by-seller',
  accessTokenValidator,
  verifiedAdminValidator,
  wrapRequestHandler(adminStatisticRevenuesInviteBySellerController)
)
export default adminStatisticRouter
