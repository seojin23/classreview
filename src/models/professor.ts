import mongoose, { Schema, Document } from 'mongoose'

export interface IProfessor extends Document {
  name: string
  department: string
  email: string
}

const ProfessorSchema: Schema = new Schema({
  name: { type: String, required: true },
  department: { type: String, required: true },
  email: { type: String, required: true, unique: true },
})

const Professor =
  mongoose.models.Professor ||
  mongoose.model<IProfessor>('Professor', ProfessorSchema)

export default Professor

// import mongoose, { Schema } from 'mongoose'

// const professorSchema = new Schema({
//   name: String,
//   department: String,
//   email: String,
// })

// const Professor =
//   mongoose.models.Professor || mongoose.model('Professor', professorSchema)

// export default Professor
