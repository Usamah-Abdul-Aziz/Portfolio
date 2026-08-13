"use client";

import React, { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

// Sera UI Button (https://seraui.com/docs/button) — adapted to plain JS/JSX.

const Loader2 = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={cn("animate-spin", className)}
  >
    <path d="M21 12a9 9 0 1 1-6.219-8.56" />
  </svg>
);

const Button = React.forwardRef(
  (
    {
      className,
      variant = "default",
      size = "default",
      children,
      loading,
      onClick,
      iconLeft,
      iconRight,
      ...props
    },
    ref
  ) => {
    const [ripples, setRipples] = useState([]);

    const iconOnly = !Boolean(children) && Boolean(iconLeft || iconRight);

    useEffect(() => {
      const styleId = "ripple-animation-style";
      if (document.getElementById(styleId)) return;

      const style = document.createElement("style");
      style.id = styleId;
      style.innerHTML = `
            @keyframes ripple-effect {
                from { transform: scale(0); opacity: 1; }
                to { transform: scale(2); opacity: 0; }
            }
            .animate-ripple { animation: ripple-effect 0.7s ease-out forwards; }
        `;
      document.head.appendChild(style);
    }, []);

    const createRipple = (event) => {
      if (loading) return;

      const button = event.currentTarget;
      const rect = button.getBoundingClientRect();
      const rippleSize = Math.max(rect.width, rect.height);
      const x = event.clientX - rect.left - rippleSize / 2;
      const y = event.clientY - rect.top - rippleSize / 2;

      const newRipple = { x, y, size: rippleSize, id: Date.now() };

      setRipples((current) => [...current, newRipple]);
      setTimeout(() => {
        setRipples((current) => current.slice(1));
      }, 700);

      onClick?.(event);
    };

    const rippleColor =
      variant === "default" || variant === "destructive"
        ? "bg-paper/30"
        : "bg-ink/10";

    const baseClasses =
      "relative inline-flex items-center justify-center rounded-full text-sm font-medium transition-transform duration-75 focus:outline-none disabled:opacity-50 disabled:pointer-events-none overflow-hidden active:scale-[0.97] cursor-pointer";

    const variantClasses = {
      default: "bg-pine text-paper-2 hover:bg-pine-deep",
      destructive: "bg-red-500 text-white hover:bg-red-600",
      outline: "border border-ink/20 bg-transparent hover:border-pine hover:text-pine text-ink",
      secondary: "bg-amber/15 text-amber hover:bg-amber/25",
      ghost: "hover:bg-ink/5 text-ink",
      link: "text-pine underline-offset-4 hover:underline",
    };

    const sizeClasses = {
      default: iconOnly ? "h-10 w-10 p-0" : "h-11 py-2 px-6",
      sm: iconOnly ? "h-9 w-9 p-0" : "h-9 px-4 text-xs",
      lg: iconOnly ? "h-12 w-12 p-0" : "h-12 px-8",
    };

    return (
      <button
        type="button"
        className={cn(baseClasses, variantClasses[variant], sizeClasses[size], className)}
        onClick={createRipple}
        disabled={loading}
        ref={ref}
        {...props}
      >
        <span className="relative z-10 flex items-center gap-2">
          {loading && <Loader2 className="h-4 w-4" />}
          {!loading && iconLeft && <span className="flex items-center justify-center">{iconLeft}</span>}
          {children}
          {!loading && iconRight && <span className="flex items-center justify-center">{iconRight}</span>}
        </span>

        {!loading && (
          <div className="absolute inset-0 z-0">
            {ripples.map((ripple) => (
              <span
                key={ripple.id}
                className={cn("absolute rounded-full animate-ripple", rippleColor)}
                style={{
                  left: ripple.x,
                  top: ripple.y,
                  width: ripple.size,
                  height: ripple.size,
                }}
              />
            ))}
          </div>
        )}
      </button>
    );
  }
);

Button.displayName = "Button";

export default Button;
