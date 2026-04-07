type PageItem = number | "ellipsis";

function getPaginationPages(
  currentPage: number,
  totalPages: number,
  siblingCount = 2
): PageItem[] {
  const pages: PageItem[] = [];

  // Always show first & last
  const firstPage = 1;
  const lastPage = totalPages;

  const leftSibling = Math.max(currentPage - siblingCount, 2);
  const rightSibling = Math.min(currentPage + siblingCount, totalPages - 1);

  // First page
  pages.push(firstPage);

  // Left ellipsis
  if (leftSibling > 2) {
    pages.push("ellipsis");
  }

  // Middle pages
  for (let i = leftSibling; i <= rightSibling; i++) {
    pages.push(i);
  }

  // Right ellipsis
  if (rightSibling < totalPages - 1) {
    pages.push("ellipsis");
  }

  // Last page
  if (totalPages > 1) {
    pages.push(lastPage);
  }

  return pages;
}

export default getPaginationPages;