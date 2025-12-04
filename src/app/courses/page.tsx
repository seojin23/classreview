// src/app/courses/page.tsx
import CoursesList from '@/components/CoursesList'

export default function CoursesPage() {
  return (
    <div className="w-full max-w-5xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-4">강의 목록</h1>

      <p className="text-gray-600 mb-8">
        강의명 또는 담당 교수로 검색할 수 있습니다.
      </p>

      <CoursesList />
    </div>
  )
}
