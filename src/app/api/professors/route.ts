import connectMongoDB from '@/libs/mongodb'
import Professor from '@/models/professor'
import Course from '@/models/course'
import Evaluation from '@/models/evaluation'
import { NextRequest, NextResponse } from 'next/server'
import { requireAdmin } from '@/libs/auth'

export async function POST(request: NextRequest) {
  try {
    await requireAdmin(request)
    const { name, department, email } = await request.json()
    if (!name || !department || !email) {
      return NextResponse.json(
        { message: '이름, 학과, 이메일은 필수입니다.' },
        { status: 400 }
      )
    }
    await connectMongoDB()
    await Professor.create({ name, department, email })
    return NextResponse.json({ message: '교수 생성됨' }, { status: 201 })
  } catch (error) {
    if (error instanceof Error) {
      if (error.message === 'unauthorized') {
        return NextResponse.json(
          { message: '로그인이 필요합니다' },
          { status: 401 }
        )
      }
      if (error.message === 'forbidden') {
        return NextResponse.json(
          { message: '관리자 권한이 필요합니다' },
          { status: 403 }
        )
      }
    }
    console.error('POST 에러 발생 /api/professors :', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function GET() {
  try {
    await connectMongoDB()
    const professors = await Professor.find()
    return NextResponse.json({ professors })
  } catch (error) {
    console.error('GET 오류 발생 /api/professors :', error)
    return NextResponse.json(
      { message: 'Internal Server Error' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    await requireAdmin(request)
    const id = request.nextUrl.searchParams.get('id')
    if (!id) {
      return NextResponse.json({ message: 'ID is required' }, { status: 400 })
    }
    await connectMongoDB()

    const professor = await Professor.findById(id)
    if (!professor) {
      return NextResponse.json(
        { message: '교수를 찾을 수 없습니다' },
        { status: 404 }
      )
    }

    const courses = await Course.find({ professor: id })

    for (const course of courses) {
      await Evaluation.deleteMany({ course: course._id })
    }

    await Course.deleteMany({ professor: id })

    await Professor.findByIdAndDelete(id)

    return NextResponse.json(
      { message: '교수와 연관된 모든 데이터가 삭제되었습니다' },
      { status: 200 }
    )
  } catch (error) {
    if (error instanceof Error) {
      if (error.message === 'unauthorized') {
        return NextResponse.json(
          { message: '로그인이 필요합니다' },
          { status: 401 }
        )
      }
      if (error.message === 'forbidden') {
        return NextResponse.json(
          { message: '관리자 권한이 필요합니다' },
          { status: 403 }
        )
      }
    }
    console.error('DELETE 오류 발생 /api/professors :', error)
    return NextResponse.json(
      { message: 'Internal Server Error' },
      { status: 500 }
    )
  }
}
