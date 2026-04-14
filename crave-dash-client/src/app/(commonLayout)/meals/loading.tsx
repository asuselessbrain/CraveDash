import AppPageLoader from "@/components/modules/shared/AppPageLoader";

export default function MealsLoading() {
  return <AppPageLoader title="Loading meal catalog" subtitle="Filtering and preparing tasty options for you..." cardCount={9} />;
}
