import { NextRequest, NextResponse } from 'next/server'
import connectMongoDB from '@/libs/mongodb'
import Course from '@/models/course'
import Professor from '@/models/professor'

export async function GET(req: NextRequest) {
  try {
    await connectMongoDB()

    const keyword = req.nextUrl.searchParams.get('keyword') || ''
    const regex = new RegExp(keyword, 'i')

    const courses = await Course.find({
      title: { $regex: regex },
    }).populate('professor')

    const professors = await Professor.find({
      name: { $regex: regex },
    })

    return NextResponse.json({
      courses: courses.map((c) => ({
        ...c.toObject(),
        _id: c._id.toString(),
      })),
      professors: professors.map((p) => ({
        ...p.toObject(),
        _id: p._id.toString(),
      })),
    })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
