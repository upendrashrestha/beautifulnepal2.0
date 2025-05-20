'use client'

import { useState } from 'react'
import { usePathname } from 'next/navigation'
import Link from '../components/Link'
import { Category, Post } from '@/types'

interface PaginationProps {
    totalPages: number
    currentPage: number
}
interface ListLayoutProps {
    posts: Post[]
    title: string
    pagination?: PaginationProps
}

function Pagination({ totalPages, currentPage }: PaginationProps) {
    const pathname = usePathname()
    const basePath = pathname
        .replace(/^\//, '') // Remove leading slash
        .replace(/\/page\/\d+\/?$/, '') // Remove any trailing /page
        .replace(/\/$/, '') // Remove trailing slash
    const prevPage = currentPage - 1 > 0
    const nextPage = currentPage + 1 <= totalPages

    return (
        <div className="space-y-2 pt-6 pb-8 md:space-y-5">
            <nav className="flex justify-between">
                {!prevPage && (
                    <button className="cursor-auto disabled:opacity-50" disabled={!prevPage}>
                        Previous
                    </button>
                )}
                {prevPage && (
                    <Link
                        href={currentPage - 1 === 1 ? `/${basePath}/` : `/${basePath}/page/${currentPage - 1}`}
                        rel="prev"
                    >
                        Previous
                    </Link>
                )}
                <span>
                    {currentPage} of {totalPages}
                </span>
                {!nextPage && (
                    <button className="cursor-auto disabled:opacity-50" disabled={!nextPage}>
                        Next
                    </button>
                )}
                {nextPage && (
                    <Link href={`/${basePath}/page/${currentPage + 1}`} rel="next">
                        Next
                    </Link>
                )}
            </nav>
        </div>
    )
}

export default function ListLayout({
    posts,
    title,
    pagination,
}: ListLayoutProps) {
    const [searchValue, setSearchValue] = useState('')
    const filteredBlogPosts = posts.filter((post) => {
        const searchContent = post.title + post.categories?.join('') + post.author?.name + post.destination?.name;
        return searchContent.toLowerCase().includes(searchValue.toLowerCase())
    })


    return (
        <>
            <div className="divide-y divide-gray-200 dark:divide-gray-700">
                <div className="space-y-2 pt-6 pb-8 md:space-y-5">
                    <h1 className="text-3xl leading-9 font-extrabold tracking-tight text-gray-900 sm:text-4xl sm:leading-10 md:text-6xl md:leading-14 dark:text-gray-100">
                        {title}
                    </h1>
                    <div className="relative max-w-lg">
                        <label>
                            <span className="sr-only">Search Blogs</span>
                            <input
                                aria-label="Search Blogs"
                                type="text"
                                onChange={(e) => setSearchValue(e.target.value)}
                                placeholder="Search articles"
                                className="focus:border-primary-500 focus:ring-primary-500 block w-full rounded-md border border-gray-300 bg-white px-4 py-2 text-gray-900 dark:border-gray-900 dark:bg-gray-800 dark:text-gray-100"
                            />
                        </label>
                        <svg
                            className="absolute top-3 right-3 h-5 w-5 text-gray-400 dark:text-gray-300"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                            />
                        </svg>
                    </div>
                </div>
                <ul>
                    {!filteredBlogPosts.length && 'No posts found.' || filteredBlogPosts.map((post) => {
                        const { title, categories, excerpt, slug, _id } = post
                        return (
                            <li key={_id} className="py-4">
                                <article className="space-y-2 xl:grid xl:grid-cols-4 xl:items-baseline xl:space-y-0">

                                    <div className="space-y-3 xl:col-span-3">
                                        <div>
                                            <h3 className="text-2xl leading-8 font-bold tracking-tight">
                                                <Link href={`/blogs/${slug}`} className="text-gray-900 dark:text-gray-100">
                                                    {title}
                                                </Link>
                                            </h3>
                                            <div className="flex flex-wrap">
                                                {categories?.map((cat: Category) => <Link key={cat._id} href={`/categories/${cat.slug}`} className="text-primary-500 hover:text-primary-600 dark:hover:text-primary-400 text-sm font-medium mr-2">{cat.title}</Link>)}
                                            </div>
                                        </div>
                                        <div className="prose max-w-none text-gray-500 dark:text-gray-400">
                                            {excerpt}
                                        </div>
                                    </div>
                                </article>
                            </li>
                        )
                    })}
                </ul>
            </div>
            {pagination && pagination.totalPages > 1 && !searchValue && (
                <Pagination currentPage={pagination.currentPage} totalPages={pagination.totalPages} />
            )}
        </>
    )
}