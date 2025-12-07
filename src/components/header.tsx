'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import {
  SignedIn,
  SignedOut,
  SignInButton,
  SignUpButton,
  UserButton,
  useUser,
} from '@clerk/nextjs'

const adminIds =
  (process.env.NEXT_PUBLIC_ADMIN_IDS ?? process.env.ADMIN_IDS)?.split(',') ?? []

export default function Header() {
  const pathname = usePathname()
  const router = useRouter()

  const { user, isSignedIn } = useUser()
  const userId = user?.id || null
  const isAdmin = !!userId && adminIds.includes(userId)

  const handleSearchClick = () => {
    router.push('/search')
  }

  const isActive = (href: string) => pathname.startsWith(href)

  return (
    <header className="border-b bg-white">
      <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-4">
        <Link href="/" className="text-lg font-bold">
          강의평가 사이트
        </Link>

        <div className="flex items-center gap-4 text-sm">
          <SignedIn>
            {isAdmin && (
              <Link
                href="/admin"
                className={
                  'hover:text-indigo-600 ' +
                  (isActive('/admin')
                    ? 'font-semibold text-indigo-600'
                    : 'text-indigo-500')
                }
              >
                관리자
              </Link>
            )}

            <Link
              href="/developers"
              className={
                'text-xs underline ' +
                (pathname === '/developers'
                  ? 'text-gray-300 italic'
                  : 'text-gray-300 hover:text-gray-400')
              }
            >
              개발진
            </Link>

            <Link
              href="/"
              className={
                'hover:text-indigo-600 ' +
                (pathname === '/'
                  ? 'font-semibold text-indigo-600'
                  : 'text-gray-700')
              }
            >
              홈
            </Link>

            <Link
              href="/courses"
              className={
                'hover:text-indigo-600 ' +
                (isActive('/courses')
                  ? 'font-semibold text-indigo-600'
                  : 'text-gray-700')
              }
            >
              강의 목록
            </Link>

            <Link
              href="/professors"
              className={
                'hover:text-indigo-600 ' +
                (isActive('/professors')
                  ? 'font-semibold text-indigo-600'
                  : 'text-gray-700')
              }
            >
              교수 목록
            </Link>

            <button
              type="button"
              onClick={handleSearchClick}
              className={
                'hover:text-indigo-600 ' +
                (isActive('/search')
                  ? 'font-semibold text-indigo-600'
                  : 'text-gray-700')
              }
            >
              검색
            </button>

            <Link
              href="/me" //임시 링크
              className={
                'hover:text-indigo-600 ' +
                (isActive('/me')
                  ? 'font-semibold text-indigo-600'
                  : 'text-gray-700')
              }
            >
              내 정보
            </Link>

            <UserButton />
          </SignedIn>

          <SignedOut>
            <SignUpButton>
              <button className="text-sm text-gray-700 underline hover:text-indigo-600">
                회원가입
              </button>
            </SignUpButton>

            <SignInButton>
              <button className="bg-[#6c47ff] text-white rounded-full font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 cursor-pointer">
                로그인
              </button>
            </SignInButton>
          </SignedOut>
        </div>
      </div>
    </header>
  )
}
