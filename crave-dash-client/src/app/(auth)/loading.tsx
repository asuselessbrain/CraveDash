import AppPageLoader from "@/components/modules/shared/AppPageLoader";

export default function AuthLoading() {
  return <AppPageLoader title="Securing your session" subtitle="Preparing authentication flow..." cardCount={2} />;
}
