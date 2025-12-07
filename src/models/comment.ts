// src/models/comment.ts
import mongoose, { Schema, Document, Model } from 'mongoose'

export interface IComment extends Document {
  user: string
  course: mongoose.Types.ObjectId // 코스는 ObjectId
  content: string
  contentRate: number
  homeworkRate: number
  examRate: number
  likes: string[] // 좋아요 누른 userId 목록
  createdAt: Date
  updatedAt: Date
}

const commentSchema = new Schema<IComment>(
  {
    user: { type: String, required: true },

    course: { type: Schema.Types.ObjectId, ref: 'Course', required: true },

    content: { type: String, required: true },
    contentRate: { type: Number, default: 0 },
    homeworkRate: { type: Number, default: 0 },
    examRate: { type: Number, default: 0 },

    likes: { type: [String], default: [] },
  },
  { timestamps: true }
)

const Comment: Model<IComment> =
  mongoose.models.Comment || mongoose.model<IComment>('Comment', commentSchema)

export default Comment
