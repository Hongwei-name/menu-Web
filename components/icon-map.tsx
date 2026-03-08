"use client";

import * as LucideIcons from "lucide-react";

interface IconMapProps {
  iconName: string;
  className?: string;
}

export function IconMap({ iconName, className = "w-6 h-6" }: IconMapProps) {
  const IconComponent = (LucideIcons as any)[iconName];

  if (!IconComponent) {
    return <LucideIcons.Link className={className} />;
  }

  return <IconComponent className={className} />;
}
