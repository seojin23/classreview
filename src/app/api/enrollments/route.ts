// src/app/api/enrollments/route.ts
import { NextRequest, NextResponse } from 'next/server'
import connectMongoDB from '@/libs/mongodb'
import Enrollment from '@/models/enrollment'
import Course from '@/models/course'
import { requireAuth } from '@/libs/auth'

// 📌 내 시간표 조회
export async function GET(request: NextRequest) {
  try {
    const userId = await requireAuth()

    await connectMongoDB()

    const enrollments = await Enrollment.find({ userId })
      .populate({
        path: 'course',
        populate: { path: 'professor' }, // 🔥 course.professor까지 같이 채워 넣기
      })
      .sort({ createdAt: 1 })

    return NextResponse.json({ enrollments })
  } catch (error) {
    if (error instanceof Error && error.message === 'unauthorized') {
      return NextResponse.json(
        { message: '로그인이 필요합니다.' },
        { status: 401 }
      )
    }
    console.error('GET /api/enrollments 오류:', error)
    return NextResponse.json(
      { message: 'Internal Server Error' },
      { status: 500 }
    )
  }
}

// 📌 강의 하나 시간표에 추가
export async function POST(request: NextRequest) {
  try {
    const userId = await requireAuth()
    const { courseId } = await request.json()

    if (!courseId) {
      return NextResponse.json(
        { message: 'courseId가 필요합니다.' },
        { status: 400 }
      )
    }

    await connectMongoDB()

    // 강의 존재 여부 확인
    const courseExists = await Course.exists({ _id: courseId })
    if (!courseExists) {
      return NextResponse.json(
        { message: '존재하지 않는 강의입니다.' },
        { status: 400 }
      )
    }

    // 이미 담겨있는지 체크
    const already = await Enrollment.exists({ userId, course: courseId })
    if (already) {
      return NextResponse.json(
        { message: '이미 시간표에 있는 강의입니다.' },
        { status: 409 }
      )
    }

    const enrollment = await Enrollment.create({ userId, course: courseId })

    return NextResponse.json(
      { message: '시간표에 추가되었습니다.', enrollment },
      { status: 201 }
    )
  } catch (error) {
    if (error instanceof Error && error.message === 'unauthorized') {
      return NextResponse.json(
        { message: '로그인이 필요합니다.' },
        { status: 401 }
      )
    }
    console.error('POST /api/enrollments 오류:', error)
    return NextResponse.json(
      { message: 'Internal Server Error' },
      { status: 500 }
    )
  }
}

// 📌 시간표에서 강의 삭제
export async function DELETE(request: NextRequest) {
  try {
    const userId = await requireAuth()
    const id = request.nextUrl.searchParams.get('id')

    if (!id) {
      return NextResponse.json(
        { message: 'id 쿼리 파라미터가 필요합니다.' },
        { status: 400 }
      )
    }

    await connectMongoDB()
    const enrollment = await Enrollment.findById(id)

    if (!enrollment) {
      return NextResponse.json(
        { message: '수강 내역을 찾을 수 없습니다.' },
        { status: 404 }
      )
    }

    if (enrollment.userId !== userId) {
      return NextResponse.json(
        { message: '삭제 권한이 없습니다.' },
        { status: 403 }
      )
    }

    await Enrollment.findByIdAndDelete(id)
    return NextResponse.json({ message: '시간표에서 삭제되었습니다.' })
  } catch (error) {
    if (error instanceof Error && error.message === 'unauthorized') {
      return NextResponse.json(
        { message: '로그인이 필요합니다.' },
        { status: 401 }
      )
    }
    console.error('DELETE /api/enrollments 오류:', error)
    return NextResponse.json(
      { message: 'Internal Server Error' },
      { status: 500 }
    )
  }
}
