import * as React from "react";
import { cn } from "../../lib/utils";

interface AuthInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  icon: React.ReactNode;
}

const AuthInput = React.forwardRef<HTMLInputElement, AuthInputProps>(
  ({ className, icon, ...props }, ref) => {
    return (
      <div className="relative group">
        <div className="flex items-center bg-auth-input-bg border border-auth-input-border rounded-xl px-4 py-3 transition-all duration-300 group-focus-within:border-primary group-focus-within:shadow-md group-focus-within:shadow-primary/20">
          <div className="text-auth-text-muted mr-3 transition-colors duration-300 group-focus-within:text-primary">
            {icon}
          </div>
          <input
            className={cn(
              "w-full outline-none bg-transparent text-foreground placeholder:text-auth-text-muted transition-colors duration-300",
              className
            )}
            ref={ref}
            {...props}
          />
        </div>
      </div>
    );
  }
);
AuthInput.displayName = "AuthInput";

export { AuthInput };