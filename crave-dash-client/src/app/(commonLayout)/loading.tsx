import AppPageLoader from "@/components/modules/shared/AppPageLoader";

export default function CommonLayoutLoading() {
  return <AppPageLoader title="Loading meals and offers" subtitle="Fetching fresh menu data for you..." cardCount={6} />;
}
