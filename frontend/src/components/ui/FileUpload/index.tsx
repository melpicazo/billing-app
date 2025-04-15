import { WarningCircleSolid } from "iconoir-react";
import phrases from "@/shared/phrases.json";
import { useState } from "react";
import { CTAButton, useBillingContext } from "@/components";
import { FileUploadModal } from "./FileUploadModal";

export const FileUpload = () => {
  const { hasData } = useBillingContext();

  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {!hasData && (
        <div className="rounded-lg bg-orange-100 p-8 border border-orange-300 border-dashed flex flex-col gap-6">
          <h3 className="text-orange-600 font-extrabold flex items-center gap-2">
            <WarningCircleSolid />
            {phrases.fileUpload.title}
          </h3>
          <p className="text-orange-600">{phrases.fileUpload.description}</p>
          <CTAButton onClick={() => setIsOpen(!isOpen)}>
            {phrases.fileUpload.ctaButton}
          </CTAButton>
        </div>
      )}
      <FileUploadModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
};
