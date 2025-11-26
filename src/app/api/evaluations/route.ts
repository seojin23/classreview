import connectMongoDB from '@/libs/mongodb'
import Evaluation from '@/models/evaluation'
import Course from '@/models/course'
import { NextRequest, NextResponse } from 'next/server'
import { requireAuth, adminIds } from '@/libs/auth'

export async function POST(request: NextRequest) {
  try {
    const userId = await requireAuth(request)
    const { course, rating, comment } = await request.json()
    if (!course || !rating) {
      return NextResponse.json(
        { message: '과목ID, 평점은 필수입니다.' },
        { status: 400 }
      )
    }
    await connectMongoDB()
    const courseExists = await Course.exists({ _id: course })
    if (!courseExists) {
      return NextResponse.json(
        { message: '유효하지 않은 과목ID 입니다.' },
        { status: 400 }
      )
    }
    await Evaluation.create({ course, authorId: userId, rating, comment })
    return NextResponse.json({ message: '평가 등록됨.' }, { status: 201 })
  } catch (error) {
    if (error instanceof Error) {
      if (error.message === 'unauthorized') {
        return NextResponse.json(
          { message: '로그인이 필요합니다' },
          { status: 401 }
        )
      }
    }
    console.error('POST 오류 발생 /api/evaluations : ', error)
    return NextResponse.json(
      { message: 'Internal Server Error' },
      { status: 500 }
    )
  }
}

export async function GET() {
  try {
    await connectMongoDB()
    const evaluations = await Evaluation.find().populate('course')
    return NextResponse.json({ evaluations })
  } catch (error) {
    console.error('GET 오류 발생 /api/evaluations :', error)
    return NextResponse.json(
      { message: 'Internal Server Error' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const userId = await requireAuth(request)
    const id = request.nextUrl.searchParams.get('id')
    if (!id) {
      return NextResponse.json({ message: 'ID가 필요합니다' }, { status: 400 })
    }
    await connectMongoDB()
    const evaluation = await Evaluation.findById(id)
    if (!evaluation) {
      return NextResponse.json(
        { message: '평가를 찾을 수 없습니다' },
        { status: 404 }
      )
    }

    // 작성자 본인인지 확인 또는 관리자 권한 확인
    if (evaluation.authorId !== userId) {
      // 작성자가 아니면 관리자 권한 여부 검사
      const isAdmin = adminIds.includes(userId)
      if (!isAdmin) {
        return NextResponse.json(
          { message: '삭제 권한이 없습니다' },
          { status: 403 }
        )
      }
    }

    await Evaluation.findByIdAndDelete(id)
    return NextResponse.json({ message: '평가 삭제됨' })
  } catch (error) {
    if (error instanceof Error) {
      if (error.message === 'unauthorized') {
        return NextResponse.json(
          { message: '로그인이 필요합니다' },
          { status: 401 }
        )
      }
    }
    console.error('DELETE 오류 발생 /api/evaluations :', error)
    return NextResponse.json(
      { message: 'Internal Server Error' },
      { status: 500 }
    )
  }
}
