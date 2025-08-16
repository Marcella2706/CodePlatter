import * as React from "react";
import { cn } from "../../lib/utils";

interface AuthCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

const AuthCard = React.forwardRef<HTMLDivElement, AuthCardProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div className="min-h-screen flex items-center justify-center auth-gradient-bg p-4 relative overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-auth-gradient-start/10 rounded-full blur-3xl floating-animation" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-auth-gradient-middle/10 rounded-full blur-3xl floating-animation" style={{ animationDelay: '2s' }} />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-auth-gradient-end/10 rounded-full blur-3xl floating-animation" style={{ animationDelay: '4s' }} />
        
        <div className="relative p-[2px] rounded-3xl auth-gradient-border glow-effect animate-bounce-in">
          <div
            ref={ref}
            className={cn(
              "bg-auth-card-bg backdrop-blur-sm rounded-3xl p-8 w-[380px] sm:w-[420px] shadow-2xl animate-fade-in",
              className
            )}
            {...props}
          >
            {children}
          </div>
        </div>
      </div>
    );
  }
);
AuthCard.displayName = "AuthCard";
export {AuthCard};