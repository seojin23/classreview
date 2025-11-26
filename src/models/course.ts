import mongoose, { Schema, Document } from 'mongoose'
import { IProfessor } from './professor'

export interface ICourse extends Document {
  title: string
  code: string
  professor: IProfessor['_id']
  credits: number
}

const CourseSchema: Schema = new Schema({
  title: { type: String, required: true },
  code: { type: String, required: true, unique: true },
  professor: { type: Schema.Types.ObjectId, ref: 'Professor', required: true },
  credits: { type: Number, required: true },
})

const Course =
  mongoose.models.Course || mongoose.model<ICourse>('Course', CourseSchema)

export default Course
