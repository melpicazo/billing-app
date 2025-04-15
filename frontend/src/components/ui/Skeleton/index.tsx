import { ButtonHTMLAttributes, RefAttributes, SVGProps } from "react";
import { CTAButton } from "../CTAButton";

interface SkeletonProps {
  title: string;
  Icon?: React.ForwardRefExoticComponent<
    Omit<SVGProps<SVGSVGElement>, "ref"> & RefAttributes<SVGSVGElement>
  >;
  description: string;
  ctaButtonProps: ButtonHTMLAttributes<HTMLButtonElement>;
}

export const Skeleton = ({
  title,
  Icon,
  description,
  ctaButtonProps,
}: SkeletonProps) => {
  return (
    <div className="rounded-lg bg-orange-100 p-8 border-orange-300 border-dashed border-2 flex flex-col gap-6">
      <h3 className="text-orange-600 font-extrabold flex items-center gap-2">
        {Icon && <Icon />}
        {title}
      </h3>
      <p className="text-orange-600">{description}</p>
      <CTAButton {...ctaButtonProps} />
    </div>
  );
};
