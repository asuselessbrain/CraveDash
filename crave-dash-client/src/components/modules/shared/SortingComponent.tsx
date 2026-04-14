'use client';

import { ArrowUpDown, Check, ChevronDown } from 'lucide-react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

type SortOrder = 'asc' | 'desc';

type SortOption = {
  label: string;
  sortBy: string;
  sortOrder: SortOrder;
};

interface SortingComponentProps {
  options: SortOption[];
  label?: string;
  sortByKey?: string;
  sortOrderKey?: string;
  pageKey?: string;
  className?: string;
}

export default function SortingComponent({
  options,
  label = 'Sort',
  sortByKey = 'sortBy',
  sortOrderKey = 'sortOrder',
  pageKey = 'page',
  className,
}: SortingComponentProps) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  if (!options.length) return null;

  const activeSortBy = searchParams.get(sortByKey);
  const activeSortOrder = searchParams.get(sortOrderKey) as SortOrder | null;

  const activeOption =
    activeSortBy && activeSortOrder
      ? options.find((option) => option.sortBy === activeSortBy && option.sortOrder === activeSortOrder)
      : undefined;

  const updateSort = (nextOption: SortOption) => {
    const params = new URLSearchParams(searchParams);

    params.set(sortByKey, nextOption.sortBy);
    params.set(sortOrderKey, nextOption.sortOrder);
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
          {label}{activeOption ? `: ${activeOption.label}` : ''}
          <ChevronDown className="h-4 w-4 opacity-70" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-64">
        <DropdownMenuRadioGroup
          value={activeOption ? `${activeOption.sortBy}:${activeOption.sortOrder}` : ''}
          onValueChange={(nextValue) => {
            const selectedOption = options.find((option) => `${option.sortBy}:${option.sortOrder}` === nextValue);

            if (selectedOption) {
              updateSort(selectedOption);
            }
          }}
        >
          {options.map((option) => (
            <DropdownMenuRadioItem key={`${option.sortBy}:${option.sortOrder}`} value={`${option.sortBy}:${option.sortOrder}`}>
              {option.label}
            </DropdownMenuRadioItem>
          ))}
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
