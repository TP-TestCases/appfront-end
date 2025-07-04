import React from 'react'
import { Icon } from '@iconify/react'

interface PaginatorProps {
    totalItems: number
    currentPage: number
    pageSize: number
    pageSizeOptions?: number[]
    showFirstLastButtons?: boolean
    onPageChange: (page: number) => void
    onPageSizeChange: (size: number) => void
}

const Paginator: React.FC<PaginatorProps> = ({
    totalItems,
    currentPage,
    pageSize,
    pageSizeOptions = [5, 10, 25, 50],
    showFirstLastButtons = true,
    onPageChange,
    onPageSizeChange
}) => {
    const totalPages = Math.max(1, Math.ceil(totalItems / pageSize))

    const getVisiblePages = (): number[] => {
        const delta = 2
        const start = Math.max(1, currentPage - delta)
        const end = Math.min(totalPages, currentPage + delta)

        const pages: number[] = []
        for (let i = start; i <= end; i++) {
            pages.push(i)
        }
        return pages
    }

    const visiblePages = getVisiblePages()

    const handlePageChange = (page: number): void => {
        if (page >= 1 && page <= totalPages && page !== currentPage) {
            onPageChange(page)
        }
    }

    const handlePageSizeChange = (event: React.ChangeEvent<HTMLSelectElement>): void => {
        const newSize = parseInt(event.target.value)
        onPageSizeChange(newSize)
    }

    return (
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 w-full">
            {/* Selector de elementos por página */}
            <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">Elementos por página:</span>
                <select
                    value={pageSize}
                    onChange={handlePageSizeChange}
                    className="border border-gray-300 rounded px-2 py-1 text-xs bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                    {pageSizeOptions.map((size) => (
                        <option key={size} value={size}>
                            {size}
                        </option>
                    ))}
                </select>
            </div>

            {/* Controles de paginación */}
            <div className="flex items-center gap-1">
                {/* Botón primera página */}
                {showFirstLastButtons && (
                    <button
                        onClick={() => handlePageChange(1)}
                        disabled={currentPage === 1}
                        className="px-2 py-1 rounded bg-gray-100 text-gray-700 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        aria-label="Primera página"
                    >
                        <Icon icon="lucide:chevrons-left" className="w-4 h-4" />
                    </button>
                )}

                {/* Botón página anterior */}
                <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="px-2 py-1 rounded bg-gray-100 text-gray-700 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    aria-label="Página anterior"
                >
                    <Icon icon="lucide:chevron-left" className="w-4 h-4" />
                </button>

                {/* Páginas */}
                {visiblePages.map((page) => (
                    <button
                        key={page}
                        onClick={() => handlePageChange(page)}
                        className={`px-3 py-1 rounded text-xs transition-colors ${page === currentPage
                            ? 'bg-blue-500 text-white font-bold'
                            : 'text-gray-700 hover:bg-gray-200'
                            }`}
                    >
                        {page}
                    </button>
                ))}

                {/* Botón página siguiente */}
                <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage >= totalPages}
                    className="px-2 py-1 rounded bg-gray-100 text-gray-700 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    aria-label="Página siguiente"
                >
                    <Icon icon="lucide:chevron-right" className="w-4 h-4" />
                </button>

                {/* Botón última página */}
                {showFirstLastButtons && (
                    <button
                        onClick={() => handlePageChange(totalPages)}
                        disabled={currentPage >= totalPages}
                        className="px-2 py-1 rounded bg-gray-100 text-gray-700 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        aria-label="Última página"
                    >
                        <Icon icon="lucide:chevrons-right" className="w-4 h-4" />
                    </button>
                )}

                {/* Información de página */}
                <span className="ml-2 text-sm text-gray-600">
                    Página {currentPage} de {totalPages}
                </span>
            </div>
        </div>
    )
}

export default Paginator