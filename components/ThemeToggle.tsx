import React from 'react';
import { useTheme } from '../contexts/ThemeContext';

interface ThemeToggleProps {
  variant?: 'button' | 'dropdown';
  className?: string;
}

const SunIcon: React.FC<{ className?: string }> = ({ className = "w-5 h-5" }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
    />
  </svg>
);

const MoonIcon: React.FC<{ className?: string }> = ({ className = "w-5 h-5" }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
    />
  </svg>
);

const MonitorIcon: React.FC<{ className?: string }> = ({ className = "w-5 h-5" }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
    />
  </svg>
);

export const ThemeToggle: React.FC<ThemeToggleProps> = ({ 
  variant = 'button', 
  className = '' 
}) => {
  const { theme, setTheme, toggleTheme } = useTheme();

  if (variant === 'button') {
    const { actualTheme } = useTheme();

    return (
      <button
        onClick={toggleTheme}
        className={`
          p-2 rounded-lg transition-colors duration-200
          bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600
          text-gray-700 dark:text-gray-300
          focus:outline-none focus:ring-2 focus:ring-primary-500
          ${className}
        `}
        title={`Tema atual: ${theme === 'system' ? `Sistema (${actualTheme})` : theme}`}
      >
        {actualTheme === 'dark' ? (
          <MoonIcon className="w-5 h-5" />
        ) : (
          <SunIcon className="w-5 h-5" />
        )}
      </button>
    );
  }

  return (
    <div className={`relative ${className}`}>
      <select
        value={theme}
        onChange={(e) => setTheme(e.target.value as 'light' | 'dark' | 'system')}
        className="
          appearance-none bg-gray-200 dark:bg-gray-700 
          text-gray-700 dark:text-gray-300
          border border-gray-300 dark:border-gray-600
          rounded-lg px-3 py-2 pr-8 text-sm
          focus:outline-none focus:ring-2 focus:ring-primary-500
        "
      >
        <option value="light">Claro</option>
        <option value="dark">Escuro</option>
        <option value="system">Sistema</option>
      </select>
      
      <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </div>
    </div>
  );
};

// Componente mais avançado com dropdown customizado
export const ThemeSelector: React.FC<{ className?: string }> = ({ className = '' }) => {
  const { theme, actualTheme, setTheme } = useTheme();
  const [isOpen, setIsOpen] = React.useState(false);

  const themes = [
    { value: 'light', label: 'Claro', icon: SunIcon },
    { value: 'dark', label: 'Escuro', icon: MoonIcon },
    { value: 'system', label: 'Sistema', icon: MonitorIcon },
  ];

  const currentTheme = themes.find(t => t.value === theme);

  return (
    <div className={`relative ${className}`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="
          flex items-center space-x-2 px-3 py-2 rounded-lg
          bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600
          text-gray-700 dark:text-gray-300 text-sm
          focus:outline-none focus:ring-2 focus:ring-primary-500
          transition-colors duration-200
        "
      >
        {currentTheme && <currentTheme.icon className="w-4 h-4" />}
        <span>{currentTheme?.label}</span>
        <svg 
          className={`w-4 h-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <>
          <div 
            className="fixed inset-0 z-10" 
            onClick={() => setIsOpen(false)}
          />
          <div className="
            absolute right-0 mt-2 w-40 bg-white dark:bg-gray-800 
            border border-gray-200 dark:border-gray-700 
            rounded-lg shadow-lg z-20
          ">
            {themes.map((themeOption) => (
              <button
                key={themeOption.value}
                                onClick={() => {
                  setTheme(themeOption.value as 'light' | 'dark' | 'system');
                  setIsOpen(false);
                }}
                className={`
                  w-full flex items-center space-x-2 px-3 py-2 text-left text-sm
                  hover:bg-gray-100 dark:hover:bg-gray-700
                  first:rounded-t-lg last:rounded-b-lg
                  transition-colors duration-200
                  ${theme === themeOption.value 
                    ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400' 
                    : 'text-gray-700 dark:text-gray-300'
                  }
                `}
              >
                <themeOption.icon className="w-4 h-4" />
                <span>{themeOption.label}</span>
                {theme === themeOption.value && (
                  <svg className="w-4 h-4 ml-auto" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                )}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
};