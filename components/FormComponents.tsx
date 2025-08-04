import React, { forwardRef } from 'react';

// Input Field Component
interface InputFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  icon?: React.ReactNode;
  variant?: 'default' | 'filled' | 'outlined';
}

export const InputField = forwardRef<HTMLInputElement, InputFieldProps>(
  ({ label, error, helperText, icon, variant = 'default', className = '', ...props }, ref) => {
    const baseClasses = 'w-full px-3 py-2 text-sm transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500';
    
    const variantClasses = {
      default: 'bg-gray-800 border border-gray-600 rounded-md text-white placeholder-gray-400',
      filled: 'bg-gray-100 border-0 rounded-md text-gray-900 placeholder-gray-500 dark:bg-gray-800 dark:text-white dark:placeholder-gray-400',
      outlined: 'bg-transparent border-2 border-gray-300 rounded-md text-gray-900 placeholder-gray-500 dark:text-white dark:placeholder-gray-400 dark:border-gray-600',
    };

    const errorClasses = error 
      ? 'border-red-500 focus:ring-red-500' 
      : 'focus:border-primary-500';

    return (
      <div className="space-y-1">
        {label && (
          <label className="block text-sm font-medium text-gray-300">
            {label}
          </label>
        )}
        
        <div className="relative">
          {icon && (
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              {icon}
            </div>
          )}
          
          <input
            ref={ref}
            className={`
              ${baseClasses}
              ${variantClasses[variant]}
              ${errorClasses}
              ${icon ? 'pl-10' : ''}
              ${className}
            `}
            {...props}
          />
        </div>
        
        {error && (
          <p className="text-sm text-red-400">{error}</p>
        )}
        
        {helperText && !error && (
          <p className="text-sm text-gray-500">{helperText}</p>
        )}
      </div>
    );
  }
);

InputField.displayName = 'InputField';

// Textarea Component
interface TextareaFieldProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
  variant?: 'default' | 'filled' | 'outlined';
}

export const TextareaField = forwardRef<HTMLTextAreaElement, TextareaFieldProps>(
  ({ label, error, helperText, variant = 'default', className = '', ...props }, ref) => {
    const baseClasses = 'w-full px-3 py-2 text-sm transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500 resize-vertical';
    
    const variantClasses = {
      default: 'bg-gray-800 border border-gray-600 rounded-md text-white placeholder-gray-400',
      filled: 'bg-gray-100 border-0 rounded-md text-gray-900 placeholder-gray-500 dark:bg-gray-800 dark:text-white dark:placeholder-gray-400',
      outlined: 'bg-transparent border-2 border-gray-300 rounded-md text-gray-900 placeholder-gray-500 dark:text-white dark:placeholder-gray-400 dark:border-gray-600',
    };

    const errorClasses = error 
      ? 'border-red-500 focus:ring-red-500' 
      : 'focus:border-primary-500';

    return (
      <div className="space-y-1">
        {label && (
          <label className="block text-sm font-medium text-gray-300">
            {label}
          </label>
        )}
        
        <textarea
          ref={ref}
          className={`
            ${baseClasses}
            ${variantClasses[variant]}
            ${errorClasses}
            ${className}
          `}
          {...props}
        />
        
        {error && (
          <p className="text-sm text-red-400">{error}</p>
        )}
        
        {helperText && !error && (
          <p className="text-sm text-gray-500">{helperText}</p>
        )}
      </div>
    );
  }
);

TextareaField.displayName = 'TextareaField';

// Select Component
interface SelectFieldProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  helperText?: string;
  options: Array<{ value: string; label: string; disabled?: boolean }>;
  placeholder?: string;
  variant?: 'default' | 'filled' | 'outlined';
}

export const SelectField = forwardRef<HTMLSelectElement, SelectFieldProps>(
  ({ label, error, helperText, options, placeholder, variant = 'default', className = '', ...props }, ref) => {
    const baseClasses = 'w-full px-3 py-2 text-sm transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500';
    
    const variantClasses = {
      default: 'bg-gray-800 border border-gray-600 rounded-md text-white',
      filled: 'bg-gray-100 border-0 rounded-md text-gray-900 dark:bg-gray-800 dark:text-white',
      outlined: 'bg-transparent border-2 border-gray-300 rounded-md text-gray-900 dark:text-white dark:border-gray-600',
    };

    const errorClasses = error 
      ? 'border-red-500 focus:ring-red-500' 
      : 'focus:border-primary-500';

    return (
      <div className="space-y-1">
        {label && (
          <label className="block text-sm font-medium text-gray-300">
            {label}
          </label>
        )}
        
        <select
          ref={ref}
          className={`
            ${baseClasses}
            ${variantClasses[variant]}
            ${errorClasses}
            ${className}
          `}
          {...props}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options.map((option) => (
            <option
              key={option.value}
              value={option.value}
              disabled={option.disabled}
            >
              {option.label}
            </option>
          ))}
        </select>
        
        {error && (
          <p className="text-sm text-red-400">{error}</p>
        )}
        
        {helperText && !error && (
          <p className="text-sm text-gray-500">{helperText}</p>
        )}
      </div>
    );
  }
);

SelectField.displayName = 'SelectField';

// Checkbox Component
interface CheckboxFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  description?: string;
  error?: string;
}

export const CheckboxField = forwardRef<HTMLInputElement, CheckboxFieldProps>(
  ({ label, description, error, className = '', ...props }, ref) => {
    return (
      <div className="space-y-1">
        <div className="flex items-start">
          <input
            ref={ref}
            type="checkbox"
            className={`
              mt-1 h-4 w-4 text-primary-600 bg-gray-800 border-gray-600 rounded
              focus:ring-primary-500 focus:ring-2 focus:ring-offset-0
              ${error ? 'border-red-500' : ''}
              ${className}
            `}
            {...props}
          />
          <div className="ml-3">
            <label className="text-sm font-medium text-gray-300">
              {label}
            </label>
            {description && (
              <p className="text-sm text-gray-500">{description}</p>
            )}
          </div>
        </div>
        
        {error && (
          <p className="text-sm text-red-400">{error}</p>
        )}
      </div>
    );
  }
);

CheckboxField.displayName = 'CheckboxField';

// Button Component
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  loadingText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ 
    variant = 'primary', 
    size = 'md', 
    isLoading = false, 
    loadingText,
    leftIcon, 
    rightIcon, 
    children, 
    disabled,
    className = '', 
    ...props 
  }, ref) => {
    const baseClasses = 'inline-flex items-center justify-center font-medium rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 disabled:opacity-50 disabled:cursor-not-allowed';
    
    const variantClasses = {
      primary: 'bg-primary-600 text-white hover:bg-primary-700 focus:ring-primary-500',
      secondary: 'bg-gray-600 text-white hover:bg-gray-700 focus:ring-gray-500',
      outline: 'border border-gray-600 text-gray-300 hover:bg-gray-800 focus:ring-gray-500',
      ghost: 'text-gray-300 hover:bg-gray-800 focus:ring-gray-500',
      danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500',
    };

    const sizeClasses = {
      sm: 'px-3 py-1.5 text-sm',
      md: 'px-4 py-2 text-sm',
      lg: 'px-6 py-3 text-base',
    };

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={`
          ${baseClasses}
          ${variantClasses[variant]}
          ${sizeClasses[size]}
          ${className}
        `}
        {...props}
      >
        {isLoading ? (
          <>
            <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2" />
            {loadingText || children}
          </>
        ) : (
          <>
            {leftIcon && <span className="mr-2">{leftIcon}</span>}
            {children}
            {rightIcon && <span className="ml-2">{rightIcon}</span>}
          </>
        )}
      </button>
    );
  }
);

Button.displayName = 'Button';