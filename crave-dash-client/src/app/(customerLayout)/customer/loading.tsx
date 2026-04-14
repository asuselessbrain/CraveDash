import AppPageLoader from "@/components/modules/shared/AppPageLoader";

export default function CustomerLoading() {
  return <AppPageLoader title="Loading customer dashboard" subtitle="Fetching your profile and order updates..." cardCount={5} />;
}
