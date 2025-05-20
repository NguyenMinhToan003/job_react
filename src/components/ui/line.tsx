import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const lineVariants = cva(
  "inline-block bg-current", // background lấy màu text hiện tại, có thể override bằng variant
  {
    variants: {
      orientation: {
        horizontal: "w-full h-px", // ngang: chiều dài đầy đủ, cao 1px
        vertical: "h-full w-px",   // dọc: chiều cao đầy đủ, rộng 1px
      },
      variant: {
        default: "bg-primary",            // màu mặc định
        destructive: "bg-destructive",    // màu lỗi
        secondary: "bg-gray-300",        // màu phụ
      },
      size: {
        sm: "h-[1px] w-[1px]",            // sẽ dùng với orientation để override cho chính xác
        default: "",                      // mặc định là 1px (đã set ở trên)
        lg: "h-[2px] w-[2px]",            // lớn hơn 1px
      },
    },
    defaultVariants: {
      orientation: "horizontal",
      variant: "default",
      size: "default",
    },
  }
)

type LineProps = React.ComponentPropsWithoutRef<"div"> &
  VariantProps<typeof lineVariants> & {
    asChild?: boolean
  }

const Line = React.forwardRef<HTMLDivElement, LineProps>(
  ({ className, orientation, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "div"

    // Tính class theo cva, lưu ý size ảnh hưởng kích thước đường kẻ theo chiều orientation
    // Nên chúng ta override chiều rộng hoặc chiều cao 1px tương ứng.
    // Với cva ở trên, size sm/lg tăng lên 2px hoặc 1px tùy chiều.

    return (
      <Comp
        ref={ref}
        className={cn(lineVariants({ orientation, variant, size }), className)}
        {...props}
      />
    )
  }
)

Line.displayName = "Line"

export { Line, lineVariants }
