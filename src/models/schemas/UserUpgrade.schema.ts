import { ObjectId } from 'mongodb'
import { StatusUpgrade } from '~/constants/enum'

export interface UserUpgradeType {
  _id?: ObjectId
  user_id: ObjectId // ID của seller
  package_id: ObjectId // ID gói nâng cấp
  admin_handle_id?: ObjectId
  upgrade_date?: Date // Ngày nâng cấp
  expiry_date?: Date // Ngày hết hạn
  status: StatusUpgrade
  upgrade_count: number
  in_use: boolean
}

export default class UserUpgrade {
  _id?: ObjectId
  user_id: ObjectId
  package_id: ObjectId
  admin_handle_id?: ObjectId
  upgrade_date?: Date
  expiry_date?: Date
  status: StatusUpgrade
  upgrade_count: number
  in_use: boolean

  constructor(userUpgrade: UserUpgradeType) {
    const date = new Date()
    this._id = userUpgrade._id
    this.user_id = userUpgrade.user_id
    this.package_id = userUpgrade.package_id
    this.admin_handle_id = userUpgrade.admin_handle_id
    this.upgrade_date = userUpgrade.upgrade_date || date
    this.expiry_date = userUpgrade.expiry_date || date
    this.status = userUpgrade.status || StatusUpgrade.Pending
    this.upgrade_count = userUpgrade.upgrade_count
    this.in_use = userUpgrade.in_use
  }
}
