import phrases from "@/shared/phrases.json";
import { useState } from "react";
import { useBillingContext } from "@/components";
import { FileUploadModal } from "./FileUploadModal";
import { Skeleton } from "../Skeleton";
import { WarningCircleSolid } from "iconoir-react";
export const FileUpload = () => {
  const { hasData } = useBillingContext();

  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {!hasData && (
        <Skeleton
          title={phrases.fileUpload.title}
          Icon={WarningCircleSolid}
          description={phrases.fileUpload.description}
          ctaButtonProps={{
            onClick: () => setIsOpen(!isOpen),
            children: phrases.fileUpload.ctaButton,
          }}
        />
      )}
      <FileUploadModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
};
