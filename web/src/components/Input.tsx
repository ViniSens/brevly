import { type ComponentProps, useState } from 'react'
import { tv } from 'tailwind-variants'
import { twMerge } from 'tailwind-merge'

const labelStyles = tv({
  base: 'text-sm font-bold text-center transition-colors',
  variants: {
    state: {
      default: 'text-gray-600',
      error: 'text-danger',
      focused: 'text-brand-base',
    },
  },
  defaultVariants: {
    state: 'default',
  },
})

const inputContainerStyles = tv({
  base: 'border rounded-md p-3 outline-none transition-colors flex items-center',
  variants: {
    state: {
      default: 'border-gray-200 focus-within:border-brand-base',
      error: 'border-danger focus-within:border-danger',
      focused: 'border-brand-base',
    },
  },
  defaultVariants: {
    state: 'default',
  },
})

const inputStyles = tv({
  base: 'outline-none bg-transparent flex-1 text-gray-600',
  variants: {
    hasPrefix: {
      true: 'text-left',
      false: 'text-center',
    },
  },
  defaultVariants: {
    hasPrefix: false,
  },
})

type InputProps = ComponentProps<'input'> & {
  label: string
  isError?: boolean
  prefix?: string
}

export function Input({ label, isError, prefix, onFocus, onBlur, className, ...props }: InputProps) {
  const [isFocused, setIsFocused] = useState(false)
  
  const state = isError ? 'error' : isFocused ? 'focused' : 'default'
  const hasPrefix = Boolean(prefix)

  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    setIsFocused(true)
    onFocus?.(e)
  }

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    setIsFocused(false)
    onBlur?.(e)
  }

  return (
    <div className="flex flex-col gap-1 w-full">
      <label
        htmlFor={props.id || props.name}
        className={labelStyles({ state })}
      >
        {label}
      </label>
      <div className={twMerge(inputContainerStyles({ state }), className)}>
        {prefix && (
          <span className="text-gray-500 font-medium select-none">
            {prefix}
          </span>
        )}
        <input
          {...props}
          id={props.id || props.name}
          className={inputStyles({ hasPrefix })}
          onFocus={handleFocus}
          onBlur={handleBlur}
        />
      </div>
    </div>
  )
}