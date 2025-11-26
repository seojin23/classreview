import { getAuth } from '@clerk/nextjs/server'
import { NextRequest } from 'next/server'
import { headers } from 'next/headers'

export const adminIds =
  process.env.ADMIN_CLERK_USER_ID?.split(',').map((id) => id.trim()) || []

export async function requireAuth(request: NextRequest) {
  const { userId } = getAuth(request)
  if (!userId) throw new Error('unauthorized')
  return userId
}

export async function requireAdmin(request: NextRequest) {
  const { userId } = getAuth(request)
  if (!userId) throw new Error('unauthorized')
  if (!adminIds.includes(userId)) throw new Error('forbidden')
  return userId
}
