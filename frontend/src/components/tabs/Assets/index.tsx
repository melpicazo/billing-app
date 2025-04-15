import { useBillingContext } from "@/components/contexts/BillingContext";

export const Assets = () => {
  const { hasData } = useBillingContext();
  if (!hasData) {
    return (
      <div className="flex flex-col gap-8">
        Looks like you have no data uploaded! Please go back to the Overview tab
        to import your data.
      </div>
    );
  }
  return <div>Assets</div>;
};
