import { FC, ReactNode } from "react";
export interface GradientTextProps {
  children: ReactNode;
  colors: string[];
  animationSpeed: number;
  showBorder: boolean;
  className?: string;
}
declare const GradientText: FC<GradientTextProps>;
export default GradientText; 