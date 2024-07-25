import { NextFunction, Request, Response } from 'express'
import paymentService from '~/services/payment.services'

export const createPaymentMethodController = async (req: Request, res: Response, next: NextFunction) => {
  const { name } = req.body
  const data = await paymentService.createPaymentMethod(name)
  return res.json({
    message: 'Create payment method success',
    data
  })
}

export const getAllPaymentMethodController = async (req: Request, res: Response, next: NextFunction) => {
  const data = await paymentService.getAllPaymentMethod()
  return res.json({
    message: 'Get all payment method success',
    data
  })
}

export const createCostBearerController = async (req: Request, res: Response, next: NextFunction) => {
  const { name } = req.body
  const data = await paymentService.createCostBearer(name)
  return res.json({
    message: 'Create cost bearer success',
    data
  })
}

export const getAllCostBearerController = async (req: Request, res: Response, next: NextFunction) => {
  const data = await paymentService.getAllCostBearer()
  return res.json({
    message: 'Get all cost bearer success',
    data
  })
}
