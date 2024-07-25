import { Router } from 'express'
import {
  addToCartController,
  cancelOrderController,
  createOrderController,
  getAllPurchaseOfSellerController,
  getCartOfSellerController,
  removeFromCartController
} from '~/controllers/purchase.controller'
import { accessTokenValidator, customerIdValidator, verifiedSellerValidator } from '~/middlewares/auth.middleware'
import { productIdValidator } from '~/middlewares/product.middlewares'
import { purchaseItemsValidator } from '~/middlewares/purchase.middleware'
import { wrapRequestHandler } from '~/utils/handler'

const sellerPurchaseRouter = Router()

sellerPurchaseRouter.post(
  '/create-order',
  accessTokenValidator,
  verifiedSellerValidator,
  customerIdValidator,
  //purchaseItemsValidator,
  wrapRequestHandler(createOrderController)
)

sellerPurchaseRouter.post(
  '/add-to-cart',
  accessTokenValidator,
  verifiedSellerValidator,
  purchaseItemsValidator,
  wrapRequestHandler(addToCartController)
)

sellerPurchaseRouter.post(
  '/cancel-order',
  accessTokenValidator,
  verifiedSellerValidator,
  wrapRequestHandler(cancelOrderController)
)

sellerPurchaseRouter.get(
  '/get-all-purchase',
  accessTokenValidator,
  verifiedSellerValidator,
  wrapRequestHandler(getAllPurchaseOfSellerController)
)

sellerPurchaseRouter.get(
  '/get-cart',
  accessTokenValidator,
  verifiedSellerValidator,
  wrapRequestHandler(getCartOfSellerController)
)

sellerPurchaseRouter.post(
  '/remove-from-cart',
  accessTokenValidator,
  verifiedSellerValidator,
  wrapRequestHandler(removeFromCartController)
)
export default sellerPurchaseRouter
