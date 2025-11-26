import connectMongoDB from '@/libs/mongodb'
import Professor from '@/models/professor'
import { NextRequest, NextResponse } from 'next/server'
import { isValidObjectId } from 'mongoose'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params

  await connectMongoDB()

  if (!isValidObjectId(id)) {
    return NextResponse.json(
      { message: '잘못된 ID 형식입니다' },
      { status: 400 }
    )
  }

  const professor = await Professor.findById(id)
  if (!professor) {
    return NextResponse.json(
      { message: '교수를 찾을 수 없습니다' },
      { status: 404 }
    )
  }

  return NextResponse.json(professor)
}
