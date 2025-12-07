import connectMongoDB from '@/libs/mongodb'
import Course from '@/models/course'
import Professor from '@/models/professor'
import Comment from '@/models/comment'
import { NextRequest, NextResponse } from 'next/server'
import { requireAdmin } from '@/libs/auth'

export async function POST(request: NextRequest) {
  try {
    await requireAdmin() // ← 수정됨 🔥

    const { title, code, professor, credits } = await request.json()
    if (!title || !code || !professor || !credits) {
      return NextResponse.json(
        { message: '과목명, 코드, 교수ID, 학점은 필수입니다.' },
        { status: 400 }
      )
    }

    await connectMongoDB()

    const professorExists = await Professor.exists({ _id: professor })
    if (!professorExists) {
      return NextResponse.json(
        { message: '유효하지 않은 교수 ID 입니다.' },
        { status: 400 }
      )
    }

    await Course.create({ title, code, professor, credits })
    return NextResponse.json({ message: '과목 생성됨' }, { status: 201 })
  } catch (error: any) {
    if (error.message === 'unauthorized')
      return NextResponse.json(
        { message: '로그인이 필요합니다' },
        { status: 401 }
      )

    if (error.message === 'forbidden')
      return NextResponse.json(
        { message: '관리자 권한이 필요합니다' },
        { status: 403 }
      )

    return NextResponse.json(
      { message: 'Internal Server Error' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    await connectMongoDB()

    const keyword = request.nextUrl.searchParams.get('keyword') || ''

    let query = {}
    if (keyword) {
      query = { title: { $regex: keyword, $options: 'i' } }
    }

    const courses = await Course.find(query).populate('professor')

    return NextResponse.json({ courses })
  } catch (error) {
    console.error(error)
    return NextResponse.json(
      { message: 'Internal Server Error' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    await requireAdmin() // ← 수정됨 🔥

    const id = request.nextUrl.searchParams.get('id')
    if (!id) {
      return NextResponse.json({ message: 'ID가 필요합니다' }, { status: 400 })
    }

    await connectMongoDB()
    await Comment.deleteMany({ course: id })
    await Course.findByIdAndDelete(id)

    return NextResponse.json({ message: '강의 삭제됨' })
  } catch (error: any) {
    if (error.message === 'unauthorized')
      return NextResponse.json(
        { message: '로그인이 필요합니다' },
        { status: 401 }
      )

    if (error.message === 'forbidden')
      return NextResponse.json(
        { message: '관리자 권한이 필요합니다' },
        { status: 403 }
      )

    return NextResponse.json(
      { message: 'Internal Server Error' },
      { status: 500 }
    )
  }
}
