import React from 'react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  color?: 'primary' | 'white' | 'gray';
  className?: string;
}

const sizeClasses = {
  sm: 'w-4 h-4',
  md: 'w-6 h-6',
  lg: 'w-8 h-8',
  xl: 'w-12 h-12',
};

const colorClasses = {
  primary: 'border-primary-600 border-t-transparent',
  white: 'border-white border-t-transparent',
  gray: 'border-gray-300 border-t-transparent dark:border-gray-600',
};

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'md',
  color = 'primary',
  className = '',
}) => {
  return (
    <div
      className={`
        animate-spin rounded-full border-2
        ${sizeClasses[size]}
        ${colorClasses[color]}
        ${className}
      `}
    />
  );
};

interface LoadingOverlayProps {
  isLoading: boolean;
  children: React.ReactNode;
  message?: string;
  className?: string;
}

export const LoadingOverlay: React.FC<LoadingOverlayProps> = ({
  isLoading,
  children,
  message = 'Carregando...',
  className = '',
}) => {
  return (
    <div className={`relative ${className}`}>
      {children}
      {isLoading && (
        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-10 rounded-lg">
          <div className="text-center">
            <LoadingSpinner size="lg" color="white" className="mx-auto mb-4" />
            <p className="text-white text-sm font-medium">{message}</p>
          </div>
        </div>
      )}
    </div>
  );
};

interface LoadingButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  isLoading: boolean;
  loadingText?: string;
  children: React.ReactNode;
}

export const LoadingButton: React.FC<LoadingButtonProps> = ({
  isLoading,
  loadingText,
  children,
  disabled,
  className = '',
  ...props
}) => {
  return (
    <button
      {...props}
      disabled={disabled || isLoading}
      className={`
        inline-flex items-center justify-center
        disabled:opacity-50 disabled:cursor-not-allowed
        ${className}
      `}
    >
      {isLoading && (
        <LoadingSpinner size="sm" color="white" className="mr-2" />
      )}
      {isLoading && loadingText ? loadingText : children}
    </button>
  );
};

interface LoadingPageProps {
  message?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const LoadingPage: React.FC<LoadingPageProps> = ({
  message = 'Carregando...',
  size = 'lg',
}) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-dark-900">
      <div className="text-center">
        <LoadingSpinner size={size} color="primary" className="mx-auto mb-4" />
        <p className="text-gray-400 text-lg">{message}</p>
      </div>
    </div>
  );
};