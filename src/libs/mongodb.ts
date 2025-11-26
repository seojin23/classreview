import mongoose from 'mongoose'

export default async function connectMongoDB() {
  try {
    await mongoose.connect(process.env.MONGODB_URI as string)
    console.log('Connected to mongoDB')
  } catch (error) {
    console.log('error connecting mongoDB', error)
  }
}
