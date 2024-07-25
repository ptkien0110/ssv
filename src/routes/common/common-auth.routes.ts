import { Router } from 'express'
import {
  addBankInfoController,
  checkSellerController,
  deleteAvatarController,
  loginController,
  logoutController,
  refreshTokenController,
  registerController,
  registryController,
  updateBankInfoController,
  uploadAvatarController
} from '~/controllers/auth.controller'
import {
  accessTokenValidator,
  bankInfoValidator,
  loginValidator,
  refreshTokenValidator,
  registerValidator,
  updateBankInfoValidator
} from '~/middlewares/auth.middleware'
import { wrapRequestHandler } from './../../utils/handler'
import uploadCloud from '~/utils/cloudinary'
import { getallProviderController } from '~/controllers/seller.controller'

const commonAuthRouter = Router()

commonAuthRouter.post('/register', registerValidator, wrapRequestHandler(registerController))

commonAuthRouter.post('/login', loginValidator, wrapRequestHandler(loginController))

commonAuthRouter.post('/refresh-token', refreshTokenValidator, wrapRequestHandler(refreshTokenController))

commonAuthRouter.post('/logout', accessTokenValidator, refreshTokenValidator, wrapRequestHandler(logoutController))

commonAuthRouter.post('/check-seller', wrapRequestHandler(checkSellerController))

commonAuthRouter.post('/registry', registerValidator, wrapRequestHandler(registryController))

commonAuthRouter.post(
  '/upload-avatar',
  accessTokenValidator,
  uploadCloud.single('image'),
  wrapRequestHandler(uploadAvatarController)
)

commonAuthRouter.delete('/delete-avatar', accessTokenValidator, wrapRequestHandler(deleteAvatarController))

commonAuthRouter.post(
  '/add-bank-info',
  accessTokenValidator,
  bankInfoValidator,
  wrapRequestHandler(addBankInfoController)
)

commonAuthRouter.put(
  '/update-bank-info',
  accessTokenValidator,
  updateBankInfoValidator,
  wrapRequestHandler(updateBankInfoController)
)

commonAuthRouter.get('/get-all-provider', accessTokenValidator, wrapRequestHandler(getallProviderController))

export default commonAuthRouter
