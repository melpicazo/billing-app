import { EmptyState } from "@/components";
import { useBillingContext } from "@/components/contexts/BillingContext";

export const Assets = () => {
  const { hasData } = useBillingContext();
  if (!hasData) return <EmptyState />;
  return <div>Assets</div>;
};
