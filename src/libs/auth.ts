// src/libs/auth.ts
import { auth } from '@clerk/nextjs/server'

export async function requireAuth() {
  const session = await auth() // ⬅ 반드시 await 필요
  const userId = session?.userId

  if (!userId) {
    throw new Error('unauthorized')
  }
  return userId
}

export const adminIds =
  process.env.ADMIN_CLERK_USER_ID?.split(',').map((id) => id.trim()) || []

export async function requireAdmin() {
  const session = await auth() // ⬅ 여기서도 await 필요
  const userId = session?.userId

  if (!userId) {
    throw new Error('unauthorized')
  }

  if (!adminIds.includes(userId)) {
    throw new Error('forbidden')
  }

  return userId
}
