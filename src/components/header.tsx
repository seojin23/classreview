'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
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
  const [showSearch, setShowSearch] = useState(false)

  const { user, isSignedIn } = useUser()
  const userId = user?.id || null
  const isAdmin = !!userId && adminIds.includes(userId)

  useEffect(() => {
    setShowSearch(false)
  }, [pathname])

  useEffect(() => {
    if (!isSignedIn) {
      setShowSearch(false)
    }
  }, [isSignedIn])

  const handleSearchToggle = () => {
    setShowSearch((prev) => !prev)
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
                  'hover:text-red-600 ' +
                  (isActive('/admin')
                    ? 'font-semibold text-red-600'
                    : 'text-red-500')
                }
              >
                관리자
              </Link>
            )}

            <Link
              href="/"
              className={
                'hover:text-blue-600 ' +
                (pathname === '/'
                  ? 'font-semibold text-blue-600'
                  : 'text-gray-700')
              }
            >
              홈
            </Link>

            <Link
              href="/courses"
              className={
                'hover:text-blue-600 ' +
                (isActive('/courses')
                  ? 'font-semibold text-blue-600'
                  : 'text-gray-700')
              }
            >
              강의 목록
            </Link>

            <Link
              href="/professors"
              className={
                'hover:text-blue-600 ' +
                (isActive('/professors')
                  ? 'font-semibold text-blue-600'
                  : 'text-gray-700')
              }
            >
              교수 목록
            </Link>

            <button
              type="button"
              onClick={handleSearchToggle}
              className={
                'hover:text-blue-600 ' +
                (showSearch ? 'font-semibold text-blue-600' : 'text-gray-700')
              }
            >
              검색
            </button>

            <Link
              href="/me"
              className={
                'hover:text-blue-600 ' +
                (isActive('/me')
                  ? 'font-semibold text-blue-600'
                  : 'text-gray-700')
              }
            >
              내 정보
            </Link>

            <UserButton />
          </SignedIn>

          <SignedOut>
            <SignUpButton>
              <button className="text-sm text-gray-700 underline hover:text-blue-600">
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

      {showSearch && isSignedIn && (
        <div className="border-b bg-gray-50">
          <div className="mx-auto max-w-5xl px-4 py-2">
            <form
              onSubmit={(e) => {
                e.preventDefault()
                //검색 연결
              }}
              className="flex items-center gap-2"
            >
              <input
                type="text"
                name="q"
                placeholder="교수명 또는 강의명으로 검색"
                className="flex-1 rounded border px-3 py-2 text-sm outline-none"
              />
              <button
                type="submit"
                className="rounded bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
              >
                검색
              </button>
            </form>
          </div>
        </div>
      )}
    </header>
  )
}
