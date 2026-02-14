import { useScrollReveal } from "@/hooks/useScrollReveal";
import { ReactNode } from "react";

interface Props {
  children: ReactNode;
  className?: string;
  variant?: "up" | "left" | "right" | "scale";
  delay?: number;
}

const ScrollRevealItem = ({ children, className = "", variant = "up", delay = 0 }: Props) => {
  const { ref, isVisible } = useScrollReveal();
  const variantClass = {
    up: "scroll-reveal",
    left: "scroll-reveal-left",
    right: "scroll-reveal-right",
    scale: "scroll-reveal-scale",
  }[variant];

  return (
    <div
      ref={ref}
      className={`${variantClass} ${isVisible ? "visible" : ""} ${className}`}
      style={delay ? { transitionDelay: `${delay}s` } : undefined}
    >
      {children}
    </div>
  );
};

export default ScrollRevealItem;
