import mongoose, { Schema, Document, Model } from 'mongoose'

export interface IComment extends Document {
  user: string
  course: string
  content: string
  contentRate: number
  homeworkRate: number
  examRate: number
  likes: number
  likedUsers: string[]
  createdAt: Date
  updatedAt: Date
}

const commentSchema = new Schema<IComment>(
  {
    user: { type: String, required: true },
    course: { type: String, required: true },
    content: { type: String, required: true },
    contentRate: { type: Number, default: 0 },
    homeworkRate: { type: Number, default: 0 },
    examRate: { type: Number, default: 0 },
    likes: { type: Number, default: 0 },
    likedUsers: { type: [String], default: [] },
  },
  { timestamps: true }
)

const Comment: Model<IComment> =
  mongoose.models.Comment || mongoose.model<IComment>('Comment', commentSchema)

export default Comment
