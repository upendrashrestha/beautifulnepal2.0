
import { cn } from "@/utils";
import * as React from "react";

const Card = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
    <div
        ref={ref}
        className={cn(
            "rounded-2xl border border-gray-100 bg-white/80 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300",
            className,
        )}
        {...props}
    />
));
Card.displayName = "Card";

const CardHeader = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
    <div
        ref={ref}
        className={cn("flex flex-col space-y-2 p-6 md:p-7 lg:p-8", className)}
        {...props}
    />
));
CardHeader.displayName = "CardHeader";

const CardTitle = React.forwardRef<
    HTMLParagraphElement,
    React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
    <h3
        ref={ref}
        className={cn(
            "text-xl md:text-2xl lg:text-3xl font-semibold leading-tight tracking-tight text-gray-800",
            className,
        )}
        {...props}
    />
));
CardTitle.displayName = "CardTitle";

const CardDescription = React.forwardRef<
    HTMLParagraphElement,
    React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
    <p
        ref={ref}
        className={cn("text-sm md:text-base text-gray-500 leading-relaxed", className)}
        {...props}
    />
));
CardDescription.displayName = "CardDescription";

const CardContent = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
    <div ref={ref} className={cn("p-6 md:p-7 lg:p-8 pt-0", className)} {...props} />
));
CardContent.displayName = "CardContent";

const CardFooter = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
    <div
        ref={ref}
        className={cn("flex flex-wrap items-center gap-3 p-6 md:p-7 lg:p-8 pt-0", className)}
        {...props}
    />
));
CardFooter.displayName = "CardFooter";

const CardBasic = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
    <div
        ref={ref}
        className={cn(
            "rounded-2xl border border-gray-100 bg-white/80 backdrop-blur-sm p-6 md:p-7 lg:p-8 shadow-md hover:shadow-lg transition-all duration-300",
            className,
        )}
        {...props}
    />
));
CardBasic.displayName = "CardBasic";

const CardGreen = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
    <Card
        ref={ref}
        className={cn(
            "border-green-100 bg-gradient-to-br from-white via-green-50/30 to-green-100/20 backdrop-blur-sm",
            "hover:shadow-green-100/50 transition-all duration-300",
            className,
        )}
        {...props}
    />
));
CardGreen.displayName = "CardGreen";

// New card variants for modern design
const CardElevated = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
    <div
        ref={ref}
        className={cn(
            "rounded-2xl bg-white shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1",
            className,
        )}
        {...props}
    />
));
CardElevated.displayName = "CardElevated";

const CardBordered = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
    <div
        ref={ref}
        className={cn(
            "rounded-2xl border-2 border-[#bc1c2b]/10 bg-white/50 backdrop-blur-sm hover:border-[#bc1c2b]/20 transition-all duration-300",
            className,
        )}
        {...props}
    />
));
CardBordered.displayName = "CardBordered";

const CardGradient = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
    <div
        ref={ref}
        className={cn(
            "rounded-2xl bg-gradient-to-br from-white via-[#faf7f2] to-[#bc1c2b]/5",
            "border border-gray-100 shadow-lg hover:shadow-xl transition-all duration-300",
            className,
        )}
        {...props}
    />
));
CardGradient.displayName = "CardGradient";

export {
    Card,
    CardHeader,
    CardFooter,
    CardTitle,
    CardDescription,
    CardContent,
    CardBasic,
    CardGreen,
    CardElevated,
    CardBordered,
    CardGradient,
};