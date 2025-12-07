// src/app/courses/page.tsx
import '../styles/course.css'
import CoursesList from '@/components/CoursesList'

export default function CoursesPage() {
  return (
    <div className="courses-page-container">
      <h1 className="courses-title">강의 목록</h1>
      <CoursesList />
    </div>
  )
}
