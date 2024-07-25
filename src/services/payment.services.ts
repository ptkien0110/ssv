import CostBearer from '~/models/schemas/CostBearer.schema'
import PaymentMethod from '~/models/schemas/PaymentMethod.schema'
import databaseService from '~/services/database.services'

class PaymentService {
  async createPaymentMethod(name: string) {
    const result = await databaseService.paymentMethods.insertOne(
      new PaymentMethod({
        name
      })
    )
    const data = await databaseService.paymentMethods.findOne({ _id: result.insertedId })
    return data
  }

  async getAllPaymentMethod() {
    const result = await databaseService.paymentMethods.find({}).toArray()
    return result
  }

  async createCostBearer(name: string) {
    const result = await databaseService.costBearers.insertOne(
      new CostBearer({
        name
      })
    )
    const data = await databaseService.costBearers.findOne({ _id: result.insertedId })
    return data
  }

  async getAllCostBearer() {
    const result = await databaseService.costBearers.find({}).toArray()
    return result
  }

  // async getCategory(category_id: string) {
  //   const category = await databaseService.categories
  //     .find({
  //       _id: new ObjectId(category_id)
  //     })
  //     .toArray()

  //   return category[0]
  // }

  // async updateCategory(category_id: string, new_name: string) {
  //   const category = await databaseService.categories.findOneAndUpdate(
  //     { _id: new ObjectId(category_id) },
  //     { $set: { name: new_name } },
  //     {
  //       upsert: true,
  //       returnDocument: 'after'
  //     }
  //   )
  //   return category
  // }
  // async deleteCategory(category_id: string) {
  //   const result = await databaseService.categories.findOneAndUpdate(
  //     { _id: new ObjectId(category_id) },
  //     { $set: { status: CategoryStatus.Hidden } },
  //     { returnDocument: 'after' }
  //   )
  //   console.log(result)
  //   return result
  // }
}

const paymentService = new PaymentService()
export default paymentService
