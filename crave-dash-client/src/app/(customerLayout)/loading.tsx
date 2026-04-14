import AppPageLoader from "@/components/modules/shared/AppPageLoader";

export default function CustomerGroupLoading() {
  return <AppPageLoader title="Loading customer area" subtitle="Preparing your orders and account details..." cardCount={6} />;
}
