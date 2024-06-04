import * as React from 'react';
import clsx from "clsx";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>  {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <button
        className={clsx("button-55", className)}
        ref={ref}
        {...props}
      >
        {children}
        </button>
    );
  }
);

export default Button