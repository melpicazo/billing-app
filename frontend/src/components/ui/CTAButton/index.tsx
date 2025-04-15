import { ArrowRight } from "iconoir-react";
import { ButtonHTMLAttributes } from "react";
import { cn } from "@/shared/utils";

export const CTAButton = ({
  children,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement>) => {
  const { className, ...rest } = props;
  return (
    <button
      className={cn(
        "group bg-orange-600 text-white px-4 py-2 rounded-md flex items-center gap-2 w-fit transition-all hover:bg-orange-700 disabled:opacity-50 disabled:pointer-events-none",
        className
      )}
      {...rest}
    >
      {children}
      <ArrowRight
        width={16}
        height={16}
        className="group-hover:translate-x-1 transition-all group-disabled:translate-x-0"
      />
    </button>
  );
};
