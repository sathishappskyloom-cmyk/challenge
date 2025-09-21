import * as Icons from 'lucide-react';
import { DivideIcon as LucideIcon } from 'lucide-react';

export function getIconComponent({ iconName }: { iconName: string; }): LucideIcon {
  const IconComponent = (Icons as any)[iconName];
  return IconComponent || Icons.HelpCircle;
}