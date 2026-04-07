'use client';

import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { useState, useEffect, useTransition } from 'react';
import { Loader2, Search as SearchIcon, X } from 'lucide-react';

interface SearchProps {
  placeholder?: string;
  debounceWait?: number;
}

export default function Search({ placeholder = 'Search...', debounceWait = 300 }: SearchProps) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();
  const [isPending, startTransition] = useTransition();
  const initialSearchTerm = searchParams.get('searchTerm') ?? '';

  const [searchTerm, setSearchTerm] = useState(initialSearchTerm);
  const [isDebouncing, setIsDebouncing] = useState(false);

  useEffect(() => {
    setSearchTerm(initialSearchTerm);
  }, [initialSearchTerm]);

  useEffect(() => {
    setIsDebouncing(true);

    const delayDebounceFn = setTimeout(() => {
      const normalizedSearchTerm = searchTerm.trim();
      const currentSearchTerm = (searchParams.get('searchTerm') ?? '').trim();

      // Only update query when search value actually changes.
      // This avoids resetting pagination on initial render.
      if (normalizedSearchTerm === currentSearchTerm) {
        setIsDebouncing(false);
        return;
      }

      const params = new URLSearchParams(searchParams);

      params.set('page', '1');

      if (normalizedSearchTerm) {
        params.set('searchTerm', normalizedSearchTerm);
      } else {
        params.delete('searchTerm');
      }

      const nextQuery = params.toString();
      const currentQuery = searchParams.toString();

      if (nextQuery !== currentQuery) {
        startTransition(() => {
          replace(nextQuery ? `${pathname}?${nextQuery}` : pathname);
        });
      }

      setIsDebouncing(false);
    }, debounceWait);

    return () => {
      clearTimeout(delayDebounceFn);
      setIsDebouncing(false);
    };
  }, [searchTerm, pathname, replace, searchParams, debounceWait]);

  const clearSearch = () => {
    setSearchTerm('');
  };

  const isLoading = isDebouncing || isPending;

  return (
    <div className="relative w-full max-w-xl">
      <label htmlFor="search" className="sr-only">
        Search
      </label>

      <div
        className="group flex h-12 items-center rounded-2xl border border-slate-200 bg-white/90 px-3 shadow-sm transition-all focus-within:border-orange-400 focus-within:ring-4 focus-within:ring-orange-100 dark:border-slate-700 dark:bg-slate-900 dark:focus-within:ring-orange-500/20"
        aria-busy={isLoading}
      >
        <SearchIcon className="h-4 w-4 text-slate-400 transition-colors group-focus-within:text-orange-500" />

        <input
          id="search"
          type="text"
          className="h-full w-full bg-transparent px-3 text-sm text-slate-800 outline-none placeholder:text-slate-400 dark:text-slate-100"
          placeholder={placeholder}
          onChange={(e) => setSearchTerm(e.target.value)}
          value={searchTerm}
          autoComplete="off"
        />

        {isLoading && (
          <Loader2 className="h-4 w-4 animate-spin text-orange-500" aria-hidden="true" />
        )}

        {!isLoading && searchTerm && (
          <button
            type="button"
            onClick={clearSearch}
            className="inline-flex h-7 w-7 items-center justify-center rounded-full text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-slate-200"
            aria-label="Clear search"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>
    </div>
  );
}