import AppPageLoader from "@/components/modules/shared/AppPageLoader";

export default function AdminLoading() {
  return <AppPageLoader title="Loading admin dashboard" subtitle="Preparing analytics and management tables..." cardCount={6} />;
}
