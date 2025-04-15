import phrases from "@/shared/phrases.json";
import { useNavigate } from "react-router-dom";
import { Skeleton } from "../Skeleton";
export const EmptyState = () => {
  const navigate = useNavigate();

  return (
    <Skeleton
      title={phrases.globals.emptyState.title}
      description={phrases.globals.emptyState.description}
      ctaButtonProps={{
        onClick: () => navigate("/"),
        children: phrases.globals.emptyState.ctaButton,
      }}
    />
  );
};
