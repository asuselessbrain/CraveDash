'use client';

import { ArrowUpDown, Check, ChevronDown } from 'lucide-react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

type SortOrder = 'asc' | 'desc';

type SortOption = {
  label: string;
  value: string;
};

interface SortingComponentProps {
  options: SortOption[];
  label?: string;
  defaultSortBy?: string;
  defaultSortOrder?: SortOrder;
  sortByKey?: string;
  sortOrderKey?: string;
  pageKey?: string;
  className?: string;
}

export default function SortingComponent({
  options,
  label = 'Sort',
  defaultSortBy,
  defaultSortOrder = 'asc',
  sortByKey = 'sortBy',
  sortOrderKey = 'sortOrder',
  pageKey = 'page',
  className,
}: SortingComponentProps) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  if (!options.length) return null;

  const activeSortBy = searchParams.get(sortByKey) ?? defaultSortBy ?? options[0].value;
  const activeSortOrder =
    (searchParams.get(sortOrderKey) as SortOrder | null) ?? defaultSortOrder;

  const activeOption = options.find((option) => option.value === activeSortBy) ?? options[0];

  const updateSort = (nextSortBy: string, nextSortOrder: SortOrder) => {
    const params = new URLSearchParams(searchParams);

    params.set(sortByKey, nextSortBy);
    params.set(sortOrderKey, nextSortOrder);
    params.set(pageKey, '1');

    const query = params.toString();
    replace(query ? `${pathname}?${query}` : pathname);
  };

  const clearSort = () => {
    const params = new URLSearchParams(searchParams);

    params.delete(sortByKey);
    params.delete(sortOrderKey);
    params.set(pageKey, '1');

    const query = params.toString();
    replace(query ? `${pathname}?${query}` : pathname);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className={className}>
          <ArrowUpDown className="h-4 w-4" />
          {label}: {activeOption.label} ({activeSortOrder.toUpperCase()})
          <ChevronDown className="h-4 w-4 opacity-70" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-64">
        <DropdownMenuLabel>Sort Field</DropdownMenuLabel>
        <DropdownMenuRadioGroup
          value={activeSortBy}
          onValueChange={(nextSortBy) => updateSort(nextSortBy, activeSortOrder)}
        >
          {options.map((option) => (
            <DropdownMenuRadioItem key={option.value} value={option.value}>
              {option.label}
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>

        <DropdownMenuSeparator />

        <DropdownMenuLabel>Order</DropdownMenuLabel>
        <DropdownMenuRadioGroup
          value={activeSortOrder}
          onValueChange={(nextSortOrder) => updateSort(activeSortBy, nextSortOrder as SortOrder)}
        >
          <DropdownMenuRadioItem value="asc">Ascending</DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="desc">Descending</DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>

        <DropdownMenuSeparator />

        <DropdownMenuItem onClick={clearSort}>
          <Check className="h-4 w-4" />
          Clear Sorting
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
