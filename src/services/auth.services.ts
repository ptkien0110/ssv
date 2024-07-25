import { ObjectId } from 'mongodb'
import { ROLE, TokenType, UserVerifyStatus } from '~/constants/enum'
import { USERS_MESSAGES } from '~/constants/messages'
import { BankInfoReqBody, CreateAccountReqBody, RegisterReqBody } from '~/models/requests/User.request'
import RefreshToken from '~/models/schemas/RefreshToken.schema'
import User from '~/models/schemas/User.schema'
import databaseService from '~/services/database.services'
import { hashPassword } from '~/utils/crypto'
import { signToken, verifyToken } from '~/utils/jwt'
import { v2 as cloudinary } from 'cloudinary'

class AuthService {
  private signAccessToken({ user_id, verify, roles }: { user_id: string; verify: UserVerifyStatus; roles: ROLE }) {
    return signToken({
      payload: {
        user_id,
        roles,
        token_type: TokenType.AccessToken,
        verify
      },
      privateKey: process.env.JWT_SECRET_ACCESS_TOKEN as string,
      options: {
        expiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN
      }
    })
  }
  private signRefreshToken({
    user_id,
    verify,
    exp,
    roles
  }: {
    user_id: string
    verify: UserVerifyStatus
    exp?: number
    roles: ROLE
  }) {
    if (exp) {
      return signToken({
        payload: {
          user_id,
          roles,
          token_type: TokenType.RefreshToken,
          verify,
          exp
        },
        privateKey: process.env.JWT_SECRET_REFRESH_TOKEN as string
      })
    }
    return signToken({
      payload: {
        user_id,
        token_type: TokenType.RefreshToken,
        verify,
        roles
      },
      privateKey: process.env.JWT_SECRET_REFRESH_TOKEN as string,
      options: {
        expiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN
      }
    })
  }

  private decodeRefreshToken(refresh_token: string) {
    return verifyToken({
      token: refresh_token,
      secretOrPublicKey: process.env.JWT_SECRET_REFRESH_TOKEN as string
    })
  }

  private signAccessTokenAndRefreshToken({
    user_id,
    verify,
    roles
  }: {
    user_id: string
    verify: UserVerifyStatus
    roles: ROLE
  }) {
    return Promise.all([
      this.signAccessToken({ user_id, verify, roles }),
      this.signRefreshToken({ user_id, verify, roles })
    ])
  }

  async checkEmailExist(email: string) {
    const user = await databaseService.users.findOne({
      email
    })
    return Boolean(user)
  }

  async register(payload: RegisterReqBody) {
    const user = await databaseService.users.insertOne(
      new User({
        ...payload,
        password: hashPassword(payload.password),
        roles: ROLE.SELLER,
        verify: UserVerifyStatus.Unverified
      })
    )
    const result = await databaseService.users.findOne({ _id: new ObjectId(user.insertedId) })
    return result
  }

  async registerProvider(payload: RegisterReqBody) {
    const user = await databaseService.users.insertOne(
      new User({
        ...payload,
        password: hashPassword(payload.password),
        roles: ROLE.PROVIDER,
        verify: UserVerifyStatus.Unverified
      })
    )
    const result = await databaseService.users.findOne({ _id: new ObjectId(user.insertedId) })
    return result
  }

  async registry(ref: string, payload: RegisterReqBody) {
    const seller = await databaseService.users.findOne({ _id: new ObjectId(ref) })
    if (!seller) {
      throw Error('Seller not found')
    }

    const sellerId = seller._id
    const user = await databaseService.users.insertOne(
      new User({
        ...payload,
        referrer_id: String(sellerId),
        password: hashPassword(payload.password),
        roles: ROLE.SELLER,
        verify: UserVerifyStatus.Unverified
      })
    )
    const result = await databaseService.users.findOne(
      { _id: new ObjectId(user.insertedId) },
      { projection: { password: 0 } }
    )
    return result
  }

  async login({ user_id, roles, verify }: { user_id: string; roles: ROLE; verify: UserVerifyStatus }) {
    const [access_token, refresh_token] = await this.signAccessTokenAndRefreshToken({
      user_id,
      roles,
      verify
    })

    const { iat, exp } = await this.decodeRefreshToken(refresh_token)

    await databaseService.refreshTokens.insertOne(
      new RefreshToken({ user_id: new ObjectId(user_id), token: refresh_token, iat, exp })
    )

    return {
      access_token,
      refresh_token
    }
  }

  async refreshToken({
    user_id,
    verify,
    refresh_token,
    roles,
    exp
  }: {
    user_id: string
    verify: UserVerifyStatus
    refresh_token: string
    roles: ROLE
    exp: number
  }) {
    const [new_access_token, new_refresh_token] = await Promise.all([
      this.signAccessToken({ user_id, verify, roles }),
      this.signRefreshToken({ user_id, verify, exp, roles }),
      databaseService.refreshTokens.deleteOne({ token: refresh_token })
    ])
    const decoded_refresh_token = await this.decodeRefreshToken(new_refresh_token)
    await databaseService.refreshTokens.insertOne(
      new RefreshToken({
        user_id: new ObjectId(user_id),
        token: new_refresh_token,
        iat: decoded_refresh_token.iat,
        exp: decoded_refresh_token.exp
      })
    )
    return {
      access_token: new_access_token,
      refresh_token: new_refresh_token
    }
  }

  async logout(refresh_token: string) {
    await databaseService.refreshTokens.deleteOne({ token: refresh_token })
    return {
      message: USERS_MESSAGES.LOGOUT_SUCCESS
    }
  }

  async checkSeller(identifier: string) {
    const isPhoneNumber = /^\d+$/.test(identifier) // Kiểm tra xem identifier có phải là số
    const query = isPhoneNumber ? { phone: identifier } : { email: identifier }
    const seller = await databaseService.users.findOne(query)
    if (!seller) {
      throw Error('Phone not found')
    }
    if (seller.roles !== ROLE.SELLER) {
      throw Error('Account not seller')
    }
    return seller._id
  }

  async createAccount(payload: CreateAccountReqBody) {
    const user = await databaseService.users.insertOne(
      new User({
        ...payload,
        password: hashPassword(payload.password),
        roles: payload.roles ? payload.roles : ROLE.SELLER,
        verify: UserVerifyStatus.Verified
      })
    )
    const result = await databaseService.users.findOne({ _id: new ObjectId(user.insertedId) })
    return result
  }

  async updateRoleAccount(user_id: string, roles: number) {
    const user = await databaseService.users.findOneAndUpdate(
      { _id: new ObjectId(user_id) },
      {
        $set: {
          roles
        }
      },
      {
        returnDocument: 'after'
      }
    )
    return user
  }

  async getAccountByRole(roles: number) {
    const result = await databaseService.users.find({ roles: roles }).toArray()
    return result
  }

  async getAllAccount({ limit, page }: { limit: number; page: number }) {
    const result = await databaseService.users
      .aggregate([
        {
          $match: {
            roles: { $ne: ROLE.ADMIN }
          }
        },
        {
          $skip: limit * (page - 1)
        },
        {
          $limit: limit
        }
      ])
      .toArray()
    const total = await databaseService.users.countDocuments({ roles: { $ne: ROLE.ADMIN } })
    return {
      result,
      total
    }
  }

  async uploadAvatar(user_id: string, fileData: any) {
    try {
      const result = await databaseService.users.updateOne(
        { _id: new ObjectId(user_id) },
        { $set: { avatar: fileData.path } }
      )

      if (result.modifiedCount === 0) {
        throw new Error('Avatar update failed')
      }

      const updatedUser = await databaseService.users.findOne({ _id: new ObjectId(user_id) })
      return updatedUser
    } catch (error) {
      await cloudinary.api.delete_resources([fileData.filename])
      throw error
    }
  }

  async deleteAvatar(user_id: string) {
    const user = await databaseService.users.updateOne({ _id: new ObjectId(user_id) }, { $set: { avatar: '' } })
    const updatedUser = await databaseService.users.findOne({ _id: new ObjectId(user_id) })
    return updatedUser
  }

  async addBankInfo(user_id: string, bank_info: { bank_name: string; account_number: string; account_name: string }) {
    const currentUser = await databaseService.users.findOne({ _id: new ObjectId(user_id) })
    if (!currentUser) {
      throw new Error('User not found')
    }

    // Kiểm tra xem bank_info đã tồn tại chưa
    if (currentUser.bank_info) {
      // Bank info đã tồn tại, không cho phép thêm mới
      throw new Error('Bank info already exist')
    }

    // Thực hiện thêm thông tin ngân hàng
    const result = await databaseService.users.updateOne({ _id: new ObjectId(user_id) }, { $set: { bank_info } })

    // Lấy thông tin người dùng đã cập nhật
    const updatedUser = await databaseService.users.findOne({ _id: new ObjectId(user_id) })
    return updatedUser
  }

  async updateBankInfo(user_id: string, payload: BankInfoReqBody) {
    const currentUser = await databaseService.users.findOne({ _id: new ObjectId(user_id) })
    if (!currentUser || !currentUser.bank_info) {
      throw new Error('User or bank information not found')
    }

    // Kết hợp thông tin hiện tại với payload
    const updatedBankInfo = {
      ...currentUser.bank_info, // Giữ nguyên thông tin hiện tại
      ...payload // Cập nhật thông tin từ payload
    }

    // Cập nhật thông tin ngân hàng của người dùng
    const result = await databaseService.users.updateOne(
      { _id: new ObjectId(user_id) },
      { $set: { bank_info: updatedBankInfo } }
    )

    // Kiểm tra xem việc cập nhật có thành công không
    if (result.modifiedCount === 0) {
      throw new Error('Bank information update failed')
    }

    // Lấy thông tin người dùng đã cập nhật
    const updatedUser = await databaseService.users.findOne({ _id: new ObjectId(user_id) })
    return updatedUser
  }
}

const authService = new AuthService()
export default authService
