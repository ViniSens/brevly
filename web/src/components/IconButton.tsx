import { type ComponentProps } from 'react'
import { tv, type VariantProps } from 'tailwind-variants'
import { Loader2 } from 'lucide-react'

const iconButtonVariants = tv({
  base: 'p-2 rounded-md transition-colors flex items-center justify-center',
  variants: {
    variant: {
      default: 'text-gray-200 hover:bg-gray-300 bg-gray-200', 
      danger: 'text-danger hover:bg-danger/30 bg-gray-200', 
    },
  },
  defaultVariants: {
    variant: 'default',
  },
})

type IconButtonProps = ComponentProps<'button'> &
  VariantProps<typeof iconButtonVariants> & {
    isLoading?: boolean
  }

export function IconButton({
  variant,
  className,
  isLoading,
  children,
  ...props
}: IconButtonProps) {
  return (
    <button
      {...props}
      disabled={isLoading}
      className={iconButtonVariants({ variant, className })}
    >
      {isLoading ? <Loader2 className="animate-spin w-4 h-4" /> : children}
    </button>
  )
}