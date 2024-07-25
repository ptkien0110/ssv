import { NextFunction, Request, Response } from 'express'
import { PRODUCT_MESSAGES } from '~/constants/messages'
import productService from '~/services/product.services'

export const createProductController = async (req: Request, res: Response, next: NextFunction) => {
  const fileData = req.files as { [fieldname: string]: Express.Multer.File[] }
  const body = req.body
  const { user_id } = req.decoded_authorization

  if (!body || !body.category) {
    return res.status(400).json({ message: 'Category is required' })
  }

  const data = await productService.createProduct({ body, user_id, fileData })

  return res.json({
    message: PRODUCT_MESSAGES.CREATE_PRODUCT_SUCCESS,
    data
  })
}

export const getProductsController = async (req: Request, res: Response) => {
  const limit = Number(req.query.limit)
  const page = Number(req.query.page)

  const data = await productService.getProducts({ limit, page })
  return res.json({
    message: PRODUCT_MESSAGES.GET_PRODUCTS_SUCCESS,
    data: {
      products: data.products,
      limit,
      page,
      total_page: Math.ceil(data.total / limit),
      total_product: data.total
    }
  })
}

export const getAllProductController = async (req: Request, res: Response) => {
  const limit = Number(req.query.limit)
  const page = Number(req.query.page)

  const data = await productService.getAllProduct({ limit, page })
  return res.json({
    message: PRODUCT_MESSAGES.GET_PRODUCTS_SUCCESS,
    data: {
      products: data.products,
      limit,
      page,
      total_page: Math.ceil(data.total / limit),
      total_product: data.total
    }
  })
}

export const getProductsByProviderController = async (req: Request, res: Response) => {
  const limit = Number(req.query.limit)
  const page = Number(req.query.page)
  const { user_id } = req.decoded_authorization
  const data = await productService.getProductsByProvider({ user_id, limit, page })
  return res.json({
    message: PRODUCT_MESSAGES.GET_PRODUCTS_SUCCESS,
    data: {
      products: data.products,
      limit,
      page,
      total_page: Math.ceil(data.total / limit),
      total_product: data.total
    }
  })
}

export const getProductController = async (req: Request, res: Response) => {
  const { product_id } = req.params
  const data = await productService.getProduct(product_id)
  return res.json({
    message: PRODUCT_MESSAGES.GET_PRODUCT_SUCCESS,
    data
  })
}

export const getProductByProviderController = async (req: Request, res: Response) => {
  const { product_id } = req.params
  const { user_id } = req.decoded_authorization
  const data = await productService.getProductByProvider(user_id, product_id)
  return res.json({
    message: PRODUCT_MESSAGES.GET_PRODUCT_SUCCESS,
    data
  })
}

export const updateProductController = async (req: Request, res: Response) => {
  const { product_id } = req.params
  const payload = req.body
  const data = await productService.updateProduct(product_id, payload)
  return res.json({
    message: PRODUCT_MESSAGES.UPDATE_PRODUCT_SUCCESS,
    data
  })
}

export const adminUpdateProductController = async (req: Request, res: Response) => {
  const { product_id } = req.params
  const payload = req.body
  const data = await productService.adminUpdateProduct(product_id, payload)
  return res.json({
    message: PRODUCT_MESSAGES.UPDATE_PRODUCT_SUCCESS,
    data
  })
}

export const changeStatusProductController = async (req: Request, res: Response) => {
  const { product_id } = req.params
  const { status } = req.body
  const data = await productService.adminChangeStatus(product_id, status)
  return res.json({
    message: PRODUCT_MESSAGES.UPDATE_STATUS_PRODUCT_SUCCESS,
    data
  })
}

export const deleteProductController = async (req: Request, res: Response) => {
  const { product_id } = req.params
  const data = await productService.deleteProduct(product_id)
  return res.json({
    message: PRODUCT_MESSAGES.DELETE_PRODUCT_SUCCESS,
    data
  })
}

export const deleteProductByProviderController = async (req: Request, res: Response) => {
  const { product_id } = req.params
  const { user_id } = req.decoded_authorization
  const data = await productService.deleteProductByProvider(user_id, product_id)
  return res.json({
    message: PRODUCT_MESSAGES.DELETE_PRODUCT_SUCCESS,
    data
  })
}

export const deleteProductImagesController = async (req: Request, res: Response) => {
  const { product_id } = req.params
  const data = await productService.deleteImagesProduct(product_id)
  return res.json({
    message: PRODUCT_MESSAGES.DELETE_IMAGES_PRODUCT_SUCCESS,
    data
  })
}

export const uploadProductImagesController = async (req: Request, res: Response) => {
  const imageFiles = req.files as Express.Multer.File[]
  const { product_id } = req.params
  const data = await productService.uploadImageProduct(product_id, imageFiles)
  return res.json({
    message: PRODUCT_MESSAGES.UPLOAD_IMAGES_SUCCESS,
    data
  })
}

export const getProductsOfProviderController = async (req: Request, res: Response) => {
  const limit = Number(req.query.limit)
  const page = Number(req.query.page)
  const { provider_id } = req.body
  const data = await productService.getProductOfProvider({ provider_id, limit, page })
  return res.json({
    message: PRODUCT_MESSAGES.GET_PRODUCTS_SUCCESS,
    data: {
      products: data.products,
      limit,
      page,
      total_page: Math.ceil(data.total / limit),
      total_product: data.total
    }
  })
}

export const getAllProductsOfProviderController = async (req: Request, res: Response) => {
  const limit = Number(req.query.limit)
  const page = Number(req.query.page)
  const { provider_id } = req.params
  const data = await productService.getAllProductOfProvider({ provider_id, limit, page })
  return res.json({
    message: PRODUCT_MESSAGES.GET_PRODUCTS_OF_PROVIDER_SUCCESS,
    data: {
      products: data.products,
      limit,
      page,
      total_page: Math.ceil(data.total / limit),
      total_product: data.total
    }
  })
}

export const getProductsBySellerController = async (req: Request, res: Response) => {
  const limit = Number(req.query.limit)
  const page = Number(req.query.page)

  const data = await productService.getProductsBySeller({ limit, page })
  return res.json({
    message: PRODUCT_MESSAGES.GET_PRODUCTS_SUCCESS,
    data: {
      products: data.products,
      limit,
      page,
      total_page: Math.ceil(data.total / limit),
      total_product: data.total
    }
  })
}

export const getProductBySellerController = async (req: Request, res: Response) => {
  const { product_id } = req.params
  const data = await productService.getProductById(product_id)
  return res.json({
    message: PRODUCT_MESSAGES.GET_PRODUCT_SUCCESS,
    data
  })
}
