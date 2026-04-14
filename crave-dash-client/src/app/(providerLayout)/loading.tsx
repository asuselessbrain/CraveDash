import AppPageLoader from "@/components/modules/shared/AppPageLoader";

export default function ProviderGroupLoading() {
  return <AppPageLoader title="Loading provider tools" subtitle="Syncing menu, orders, and performance data..." cardCount={6} />;
}
