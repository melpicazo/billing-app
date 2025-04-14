import { ArrowRight, WarningCircleSolid } from "iconoir-react";
import phrases from "@/shared/phrases.json";
import { useState } from "react";
import { useBillingContext } from "@/components";
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
          <button
            className="group bg-orange-600 text-white px-4 py-2 rounded-md flex items-center gap-2 w-fit transition-all hover:bg-orange-700"
            onClick={() => setIsOpen(!isOpen)}
          >
            {phrases.fileUpload.ctaButton}
            <ArrowRight
              width={16}
              height={16}
              className="group-hover:translate-x-1 transition-all"
            />
          </button>
        </div>
      )}
      <FileUploadModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
};
