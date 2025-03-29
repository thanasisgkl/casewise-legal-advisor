
import { ReactNode } from "react";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface CardFeatureProps {
  icon: LucideIcon;
  title: string;
  description: string;
  className?: string;
}

export function CardFeature({ icon: Icon, title, description, className }: CardFeatureProps) {
  return (
    <div className={cn(
      "relative group bg-white rounded-lg p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200",
      className
    )}>
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-legal-navy to-legal-gold transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>
      <div className="mb-4 flex items-center justify-center w-12 h-12 rounded-full bg-legal-navy/10 text-legal-navy">
        <Icon className="h-6 w-6" />
      </div>
      <h3 className="text-lg font-medium mb-2">{title}</h3>
      <p className="text-gray-500">{description}</p>
    </div>
  );
}
