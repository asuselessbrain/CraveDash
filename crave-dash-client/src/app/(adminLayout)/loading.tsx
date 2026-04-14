import AppPageLoader from "@/components/modules/shared/AppPageLoader";

export default function AdminGroupLoading() {
  return <AppPageLoader title="Loading admin panel" subtitle="Gathering users, orders, and insights..." cardCount={6} />;
}
