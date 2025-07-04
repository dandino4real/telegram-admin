'use client'

import React from 'react'

const SidebarSkeleton = () => {
  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar Skeleton */}
      <aside className="w-64 bg-white shadow-md p-6 space-y-6">
        <div className="space-y-2">
          <div className="h-8 bg-gray-200 animate-pulse rounded w-32"></div>
          <div className="h-4 bg-gray-200 animate-pulse rounded w-24"></div>
        </div>
        <div className="space-y-4">
          <div className="h-6 bg-gray-200 animate-pulse rounded w-20 mx-6"></div>
          <div className="space-y-2">
            <div className="h-4 bg-gray-200 animate-pulse rounded w-24 mx-6"></div>
            <div className="h-6 bg-gray-200 animate-pulse rounded w-24 mx-6"></div>
            <div className="h-6 bg-gray-200 animate-pulse rounded w-24 mx-6"></div>
          </div>
          <div className="space-y-2">
            <div className="h-4 bg-gray-200 animate-pulse rounded w-24 mx-6"></div>
            <div className="h-6 bg-gray-200 animate-pulse rounded w-24 mx-6"></div>
          </div>
        </div>
      </aside>

      {/* Main Content Skeleton */}
      <main className="flex-1 p-6 overflow-auto">
        <div className="h-8 bg-gray-200 animate-pulse rounded w-48 mb-6"></div>
        <div className="grid grid-cols-3 gap-4 text-center">
          <div className="p-4 bg-white rounded-lg shadow space-y-2">
            <div className="h-4 bg-gray-200 animate-pulse rounded w-20 mx-auto"></div>
            <div className="h-6 bg-gray-200 animate-pulse rounded w-12 mx-auto"></div>
          </div>
          <div className="p-4 bg-white rounded-lg shadow space-y-2">
            <div className="h-4 bg-gray-200 animate-pulse rounded w-20 mx-auto"></div>
            <div className="h-6 bg-gray-200 animate-pulse rounded w-12 mx-auto"></div>
          </div>
          <div className="p-4 bg-white rounded-lg shadow space-y-2">
            <div className="h-4 bg-gray-200 animate-pulse rounded w-20 mx-auto"></div>
            <div className="h-6 bg-gray-200 animate-pulse rounded w-12 mx-auto"></div>
          </div>
        </div>

        <div className="mt-6 bg-white p-6 rounded-lg shadow space-y-4">
          <div className="h-6 bg-gray-200 animate-pulse rounded w-1/3"></div>
          <div className="flex justify-between items-center space-x-4">
            <div className="h-10 bg-gray-200 animate-pulse rounded w-1/3"></div>
            <div className="flex space-x-4">
              <div className="h-10 bg-gray-200 animate-pulse rounded w-1/4"></div>
              <div className="h-10 bg-gray-200 animate-pulse rounded w-1/4"></div>
              <div className="h-10 bg-gray-200 animate-pulse rounded w-1/6"></div>
            </div>
          </div>
          <div className="space-y-2">
            <div className="h-10 bg-gray-200 animate-pulse rounded w-full"></div>
            {[...Array(5)].map((_, index) => (
              <div key={index} className="flex space-x-4">
                <div className="h-10 bg-gray-200 animate-pulse rounded w-1/6"></div>
                <div className="h-10 bg-gray-200 animate-pulse rounded w-1/6"></div>
                <div className="h-10 bg-gray-200 animate-pulse rounded w-1/12"></div>
                <div className="h-10 bg-gray-200 animate-pulse rounded w-1/6"></div>
                <div className="h-10 bg-gray-200 animate-pulse rounded w-1/6"></div>
                <div className="h-10 bg-gray-200 animate-pulse rounded w-1/6"></div>
                <div className="h-10 bg-gray-200 animate-pulse rounded w-1/12"></div>
              </div>
            ))}
            <div className="h-4 bg-gray-200 animate-pulse rounded w-20"></div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default SidebarSkeleton