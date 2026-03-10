import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl border-2 text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default:
          "border-black bg-logo-gradient text-primary-foreground shadow-hard hover:-translate-y-0 hover:translate-x-1 hover:translate-y-1 hover:shadow-none",
        site:
          "cta-shine border border-primary/40 bg-primary text-primary-foreground font-black tracking-wide glow-primary hover:scale-[1.03]",
        destructive:
          "border-black bg-destructive text-destructive-foreground shadow-hard hover:translate-x-1 hover:translate-y-1 hover:shadow-none",
        outline:
          "border-border bg-background text-foreground shadow-hard hover:bg-primary hover:text-primary-foreground hover:translate-x-1 hover:translate-y-1 hover:shadow-none",
        secondary:
          "border-border bg-card text-foreground shadow-hard hover:bg-secondary hover:text-secondary-foreground hover:translate-x-1 hover:translate-y-1 hover:shadow-none",
        ghost: "border-transparent bg-transparent text-foreground shadow-none hover:border-border hover:bg-primary/15 hover:text-primary",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 px-3 text-xs",
        lg: "h-10 px-8",
        icon: "h-9 w-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
