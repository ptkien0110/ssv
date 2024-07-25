import { Router } from 'express'
import {
  createProductController,
  deleteProductByProviderController,
  deleteProductImagesController,
  getProductController,
  getProductsByProviderController,
  updateProductController,
  uploadProductImagesController
} from '~/controllers/product.controller'
import { accessTokenValidator, verifiedProviderValidator } from '~/middlewares/auth.middleware'
import { filterMiddleware } from '~/middlewares/common.middleware'
import {
  createProductValidator,
  paginationValidator,
  productIdValidator,
  productValidator
} from '~/middlewares/product.middlewares'
import { UpdateProductReqBody } from '~/models/requests/Product.request'
import uploadCloud from '~/utils/cloudinary'
import { wrapRequestHandler } from '~/utils/handler'

const providerProductRouter = Router()

providerProductRouter.post(
  '/',
  accessTokenValidator,
  verifiedProviderValidator,
  uploadCloud.fields([
    { name: 'images', maxCount: 4 },
    { name: 'invoice_images', maxCount: 4 }
  ]),
  createProductValidator,
  wrapRequestHandler(createProductController)
)

providerProductRouter.get(
  '/',
  accessTokenValidator,
  verifiedProviderValidator,
  paginationValidator,
  wrapRequestHandler(getProductsByProviderController)
)

providerProductRouter.get(
  '/:product_id',
  accessTokenValidator,
  verifiedProviderValidator,
  productIdValidator,
  wrapRequestHandler(getProductController)
)

providerProductRouter.put(
  '/:product_id',
  accessTokenValidator,
  verifiedProviderValidator,
  productValidator,
  filterMiddleware<UpdateProductReqBody>([
    'name',
    'description',
    'category',
    'price_original',
    'sales',
    'store',
    'store_company',
    'note'
  ]),
  wrapRequestHandler(updateProductController)
)

providerProductRouter.delete(
  '/delete/:product_id',
  accessTokenValidator,
  verifiedProviderValidator,
  productIdValidator,
  wrapRequestHandler(deleteProductByProviderController)
)

providerProductRouter.delete(
  '/delete/:product_id/images',
  accessTokenValidator,
  verifiedProviderValidator,
  productIdValidator,
  wrapRequestHandler(deleteProductImagesController)
)

providerProductRouter.post(
  '/:product_id/images',
  accessTokenValidator,
  verifiedProviderValidator,
  uploadCloud.array('images'),
  wrapRequestHandler(uploadProductImagesController)
)

export default providerProductRouter
