import { useResetData } from "@/api/queries";
import { useBillingContext } from "@/components/contexts";
import { CTAButton, Modal } from "@/components/ui";
import phrases from "@/shared/phrases.json";
import { useState } from "react";

export const Settings = () => {
  const [isOpen, setIsOpen] = useState(false);
  const resetMutation = useResetData();
  const { hasData } = useBillingContext();

  const handleReset = async () => {
    try {
      await resetMutation.mutateAsync();
      setIsOpen(false);
    } catch (error) {
      console.error("Failed to reset data:", error);
    }
  };

  return (
    <>
      <div className="flex flex-col gap-8">
        <h2>{phrases.settings.reset.title}</h2>
        <p>{phrases.settings.reset.description}</p>
        <CTAButton
          onClick={() => setIsOpen(!isOpen)}
          className="bg-red-600 hover:bg-red-700"
          disabled={!hasData}
        >
          {phrases.settings.reset.ctaButton}
        </CTAButton>
      </div>
      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title={phrases.settings.reset.title}
        ctaButtonProps={{
          onClick: handleReset,
          className: "bg-red-600 hover:bg-red-700",
          disabled: resetMutation.isPending,
          children: resetMutation.isPending
            ? "Resetting..."
            : phrases.settings.reset.modal.ctaButton,
        }}
      >
        <div className="flex flex-col gap-8">
          <p>{phrases.settings.reset.modal.description}</p>
          {resetMutation.isError && (
            <p className="text-red-600">
              Error: {(resetMutation.error as Error).message}
            </p>
          )}
        </div>
      </Modal>
    </>
  );
};
