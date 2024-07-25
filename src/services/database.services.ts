import { ClientSession, Collection, Db, MongoClient } from 'mongodb'
import { config } from 'dotenv'
import User from '~/models/schemas/User.schema'
import RefreshToken from '~/models/schemas/RefreshToken.schema'
import Category from '~/models/schemas/Category.schema'
import Product from '~/models/schemas/Product.schema'
import Customer from '~/models/schemas/Customer.schema'
import Purchase from '~/models/schemas/Purchase.schema'
import TotalRevenues from './../models/schemas/TotalRevenues.schema'
import RevenuesAffiliate from '~/models/schemas/RevenueAffiliate.schema'
import UpgradePackage from '~/models/schemas/UpgradePackage.schema'
import UserUpgrade from '~/models/schemas/UserUpgrade.schema'
import RevenuesInvite from '~/models/schemas/RevenueInvite.schema'
import PaymentMethod from '~/models/schemas/PaymentMethod.schema'
import CostBearer from '~/models/schemas/CostBearer.schema'
config()
const uri = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@samurai.brgwcpm.mongodb.net/`
class DatabaseService {
  private client: MongoClient
  private db: Db
  constructor() {
    this.client = new MongoClient(uri)
    this.db = this.client.db(process.env.DB_NAME)
  }

  async connect() {
    try {
      // Send a ping to confirm a successful connection
      await this.db.command({ ping: 1 })
      console.log('Pinged your deployment. You successfully connected to MongoDB!')
    } catch (error) {
      console.log('Error', error)
      throw error
    }
  }

  get users(): Collection<User> {
    return this.db.collection(process.env.DB_COLLECTION_USER as string)
  }

  get refreshTokens(): Collection<RefreshToken> {
    return this.db.collection(process.env.DB_COLLECTION_REFRESH_TOKENS as string)
  }

  get categories(): Collection<Category> {
    return this.db.collection(process.env.DB_COLLECTION_CATEGORIES as string)
  }

  get products(): Collection<Product> {
    return this.db.collection(process.env.DB_COLLECTION_PRODUCTS as string)
  }

  get customers(): Collection<Customer> {
    return this.db.collection(process.env.DB_COLLECTION_CUSTOMERS as string)
  }

  get purchases(): Collection<Purchase> {
    return this.db.collection(process.env.DB_COLLECTION_PURCHASES as string)
  }

  get totalRevenues(): Collection<TotalRevenues> {
    return this.db.collection(process.env.DB_COLLECTION_TOTAL_REVENUES as string)
  }

  get revenuesAffiliate(): Collection<RevenuesAffiliate> {
    return this.db.collection(process.env.DB_COLLECTION_REVENUES_AFFILIATE as string)
  }

  get upgradePackages(): Collection<UpgradePackage> {
    return this.db.collection(process.env.DB_COLLECTION_UPGRADE_PACKAGES as string)
  }

  get userUpgrades(): Collection<UserUpgrade> {
    return this.db.collection(process.env.DB_COLLECTION_USER_UPGRADES as string)
  }

  get revenuesInvite(): Collection<RevenuesInvite> {
    return this.db.collection(process.env.DB_COLLECTION_REVENUES_INVITE as string)
  }

  get paymentMethods(): Collection<PaymentMethod> {
    return this.db.collection(process.env.DB_COLLECTION_PAYMENT_METHODS as string)
  }

  get costBearers(): Collection<CostBearer> {
    return this.db.collection(process.env.DB_COLLECTION_COST_BEARERS as string)
  }

  async startSession(): Promise<ClientSession> {
    await this.client.connect() // Ensure the client is connected
    return this.client.startSession()
  }

  async withTransaction(fn: (session: ClientSession) => Promise<void>, session: ClientSession): Promise<void> {
    await session.withTransaction(fn)
  }
}

const databaseService = new DatabaseService()
export default databaseService
