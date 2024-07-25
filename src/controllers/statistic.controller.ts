import { Request, Response } from 'express'
import statisticService from '~/services/statistic.services'

export const statisticRevenuesController = async (req: Request, res: Response) => {
  const { user_id } = req.decoded_authorization
  const { startTime, endTime } = req.body
  const data = await statisticService.statisticRevenuesByTime(user_id, startTime, endTime)

  if (!data) {
    // Nếu không có doanh thu trong khoảng thời gian đã cho trả về message và totalMoney = 0
    return res.json({
      message: 'Không có doanh thu trong khoảng thời gian đã cho',
      data: { totalMoney: 0 } //
    })
  }
  return res.json({
    message: 'Statistic revenues success',
    data
  })
}

export const adminStatisticRevenuesByProviderController = async (req: Request, res: Response) => {
  const { user_id } = req.body
  const { startTime, endTime } = req.body

  const data = await statisticService.adminStatisticRevenuesPDPByTime(user_id, startTime, endTime)

  if (!data) {
    // Nếu không có doanh thu trong khoảng thời gian đã cho trả về message và totalMoney = 0
    return res.json({
      message: 'Không có doanh thu trong khoảng thời gian đã cho',
      data: { totalMoney: 0 } //
    })
  }
  return res.json({
    message: 'Statistic revenues by provider success',
    data
  })
}

export const statisticRevenuesByProviderController = async (req: Request, res: Response) => {
  const { user_id } = req.decoded_authorization
  const { startTime, endTime } = req.body

  const data = await statisticService.adminStatisticRevenuesPDPByTime(user_id, startTime, endTime)

  if (!data) {
    // Nếu không có doanh thu trong khoảng thời gian đã cho trả về message và totalMoney = 0
    return res.json({
      message: 'Không có doanh thu trong khoảng thời gian đã cho',
      data: { totalMoney: 0 } //
    })
  }
  return res.json({
    message: 'Statistic revenues success',
    data
  })
}

export const adminStatisticRevenuesBySellerController = async (req: Request, res: Response) => {
  const { user_id } = req.body
  const { startTime, endTime } = req.body

  const data = await statisticService.adminStatisticRevenuesSellerByTime(user_id, startTime, endTime)

  if (!data) {
    // Nếu không có doanh thu trong khoảng thời gian đã cho trả về message và totalMoney = 0
    return res.json({
      message: 'Không có doanh thu trong khoảng thời gian đã cho',
      data: { totalMoney: 0 } //
    })
  }
  return res.json({
    message: 'Statistic revenues by seller success',
    data
  })
}

export const adminStatisticRevenuesInviteController = async (req: Request, res: Response) => {
  const { user_id } = req.decoded_authorization
  const { startTime, endTime } = req.body

  const data = await statisticService.adminStatisticRevenuesInvite(user_id, startTime, endTime)

  if (!data) {
    // Nếu không có doanh thu trong khoảng thời gian đã cho trả về message và totalMoney = 0
    return res.json({
      message: 'Không có doanh thu trong khoảng thời gian đã cho',
      data: { totalMoney: 0 } //
    })
  }
  return res.json({
    message: 'Statistic revenues invite success',
    data
  })
}

export const adminStatisticRevenuesInviteBySellerController = async (req: Request, res: Response) => {
  const { user_id } = req.body
  const { startTime, endTime } = req.body

  const data = await statisticService.adminStatisticRevenuesInvite(user_id, startTime, endTime)

  if (!data) {
    // Nếu không có doanh thu trong khoảng thời gian đã cho trả về message và totalMoney = 0
    return res.json({
      message: 'Không có doanh thu trong khoảng thời gian đã cho',
      data: { totalMoney: 0 } //
    })
  }
  return res.json({
    message: 'Statistic revenues invite by seller success',
    data
  })
}
