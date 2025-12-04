// src/libs/auth.ts
import { auth, currentUser } from '@clerk/nextjs/server'

export const adminIds =
  process.env.ADMIN_CLERK_USER_ID?.split(',').map((id) => id.trim()) || []

/* 로그인만 필요할 때 */
export async function requireAuth() {
  const { userId } = await auth()
  if (!userId) {
    throw new Error('unauthorized')
  }
  return userId
}

/* 관리자 권한 필요할 때 */
export async function requireAdmin() {
  const { userId } = await auth()
  if (!userId) throw new Error('unauthorized')

  if (!adminIds.includes(userId)) {
    throw new Error('forbidden')
  }

  return userId
}

/* 더 확장된 유저 정보가 필요할 때 */
export async function getUserProfile() {
  const user = await currentUser()
  if (!user) return null

  return {
    id: user.id,
    email: user.primaryEmailAddress?.emailAddress ?? '',
    name: user.fullName ?? user.username ?? '',
    imageUrl: user.imageUrl ?? '',
  }
}
