// src/models/enrollment.ts
import mongoose, { Schema, Document } from 'mongoose'
import { ICourse } from './course'

export interface IEnrollment extends Document {
  userId: string
  course: ICourse['_id']
  createdAt: Date
}

const EnrollmentSchema: Schema = new Schema(
  {
    userId: { type: String, required: true },
    course: { type: Schema.Types.ObjectId, ref: 'Course', required: true },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
  }
)

const Enrollment =
  mongoose.models.Enrollment ||
  mongoose.model<IEnrollment>('Enrollment', EnrollmentSchema)

export default Enrollment
