import { type ComponentProps } from 'react'
import { tv, type VariantProps } from 'tailwind-variants'
import { Loader2 } from 'lucide-react'

const buttonVariants = tv({
  base: 'py-2 px-4 rounded-md font-bold transition-all flex items-center justify-center gap-2',
  variants: {
    variant: {
      primary: 'bg-brand-base text-white hover:bg-brand-dark',
      secondary: 'bg-brand-base/10 text-brand-base hover:bg-brand-base/20 border border-brand-dark',
      tertiary: 'bg-transparent text-brand-base hover:bg-brand-base/10',
    },
    disabled: {
      true: '',
    },
  },
  compoundVariants: [
    {
      variant: 'primary',
      disabled: true,
      className: 'bg-gray-200 text-gray-400 cursor-not-allowed',
    },
    {
      variant: ['secondary', 'tertiary'],
      disabled: true,
      className: 'bg-transparent text-gray-400 cursor-not-allowed',
    },
  ],
  defaultVariants: {
    variant: 'primary',
  },
})

type ButtonProps = ComponentProps<'button'> &
  VariantProps<typeof buttonVariants> & {
    isLoading?: boolean
  }

export function Button({
  variant,
  disabled,
  className,
  isLoading,
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      {...props}
      disabled={disabled || isLoading}
      className={buttonVariants({ variant, disabled, className })}
    >
      {isLoading ? <Loader2 className="animate-spin" /> : children}
    </button>
  )
}