import mongoose, { Schema, Document } from 'mongoose'
import { ICourse } from './course'

export interface IEvaluation extends Document {
  course: ICourse['_id']
  authorId: string
  rating: number
  comment?: string
  createdAt: Date
}

const EvaluationSchema: Schema = new Schema({
  course: { type: Schema.Types.ObjectId, ref: 'Course', required: true },
  authorId: { type: String, required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  comment: { type: String },
  createdAt: { type: Date, default: Date.now },
})

const Evaluation =
  mongoose.models.Evaluation ||
  mongoose.model<IEvaluation>('Evaluation', EvaluationSchema)

export default Evaluation
