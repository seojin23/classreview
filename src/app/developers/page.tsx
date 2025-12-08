'use client'

import Link from 'next/link'

const developers = [
  {
    _id: '1',
    name: '최윤성',
    github: 'https://github.com/ysysys91',
    portfolio: 'https://final-exam-delta-woad.vercel.app',
    avatar: '',
  },
  {
    _id: '2',
    name: '손유승',
    github: 'https://github.com/Jannerf',
    portfolio: 'https://sonyouseung-web-origin.vercel.app',
    avatar: '',
  },
  {
    _id: '3',
    name: '고연우',
    github: 'https://github.com/yws3267',
    portfolio: 'https://portfoliov-three.vercel.app',
    avatar: '',
  },
  {
    _id: '4',
    name: '유태강',
    github: 'https://github.com/green14712-byte',
    portfolio: 'https://teakangportfolio.vercel.app',
    avatar: '',
  },
  {
    _id: '5',
    name: '한서진',
    github: 'https://github.com/seojin23',
    portfolio: 'https://portfolio2-nextjs-kohl.vercel.app/',
    avatar: '',
  },
  {
    _id: '6',
    name: '황인성',
    github: 'https://github.com/provelly',
    portfolio: 'https://clerk-app-zeta.vercel.app',
    avatar: '',
  },
]

export default function DevelopersList() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 w-full">
      {developers.map((dev) => (
        <div key={dev._id} className="group block h-full cursor-pointer">
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-lg hover:border-indigo-200 transition-all duration-300 p-6 flex flex-col items-center text-center h-full relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity" />

            {dev.avatar ? (
              <img
                src={dev.avatar}
                alt={dev.name}
                className="w-20 h-20 rounded-full object-cover mb-4 group-hover:scale-110 transition-transform duration-300 shadow-md"
              />
            ) : (
              <div className="w-20 h-20 bg-indigo-50 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 shadow-inner">
                <span className="text-3xl font-bold text-indigo-600">
                  {dev.name.charAt(0)}
                </span>
              </div>
            )}

            <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-indigo-600 transition-colors">
              {dev.name}
            </h3>

            {dev.github && (
              <a
                href={dev.github}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-blue-600 break-all px-2"
              >
                <span className="font-semibold text-gray-700">Github: </span>
                {dev.github}
              </a>
            )}

            {dev.portfolio && (
              <a
                href={dev.portfolio}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-blue-600 break-all px-2 mt-1"
              >
                <span className="font-semibold text-gray-700">Portfolio: </span>
                {dev.portfolio}
              </a>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}
