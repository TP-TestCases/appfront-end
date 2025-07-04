import { useState, useEffect, useCallback } from 'react';

export interface PaginationResponse<T> {
    items: T[];
    total: number;
    pages: number;
    page: number;
}

interface UsePaginationArgs<T> {
    apiFn: (page: number, size: number) => Promise<PaginationResponse<T>>;
    initialPage?: number;
    initialSize?: number;
}

export function usePagination<T>({
    apiFn,
    initialPage = 1,
    initialSize = 10,
}: UsePaginationArgs<T>): {
    items: T[];
    loading: boolean;
    error: Error | null;
    currentPage: number;
    pageSize: number;
    totalPages: number;
    totalItems: number;
    handlePageChange: (page: number) => void;
    handlePageSizeChange: (size: number) => void;
} {
    const [items, setItems] = useState<T[]>([]);
    const [currentPage, setCurrentPage] = useState(initialPage);
    const [pageSize, setPageSize] = useState(initialSize);
    const [totalPages, setTotalPages] = useState(1);
    const [totalItems, setTotalItems] = useState(0);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    const loadPage = useCallback(async (page: number, size: number) => {
        setLoading(true);
        setError(null);
        try {
            const res = await apiFn(page, size);
            setItems(res.items);
            setTotalItems(res.total);
            setTotalPages(res.pages);
            setCurrentPage(res.page);
        } catch (err) {
            setError(err as Error);
        } finally {
            setLoading(false);
        }
    }, [apiFn]);

    useEffect(() => {
        loadPage(currentPage, pageSize);
    }, [loadPage, currentPage, pageSize]);

    const handlePageChange = (page: number): void => {
        setCurrentPage(page);
    };

    const handlePageSizeChange = (size: number): void => {
        setPageSize(size);
        setCurrentPage(1);
    };

    return {
        items,
        loading,
        error,
        currentPage,
        pageSize,
        totalPages,
        totalItems,
        handlePageChange,
        handlePageSizeChange,
    };
}
