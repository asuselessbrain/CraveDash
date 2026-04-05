import { redirect } from "next/navigation";

type BrowsePageProps = {
  searchParams?: Record<string, string | string[] | undefined>;
};

export default function BrowsePage({ searchParams }: BrowsePageProps) {
  const params = new URLSearchParams();

  Object.entries(searchParams ?? {}).forEach(([key, value]) => {
    if (Array.isArray(value)) {
      value.forEach((item) => params.append(key, item));
      return;
    }

    if (typeof value === "string") {
      params.set(key, value);
    }
  });

  const query = params.toString();
  redirect(query ? `/meals?${query}` : "/meals");
}
