import { forwardRef } from 'react';

const Input = forwardRef(({
  label,
  error,
  helperText,
  className = '',
  containerClassName = '',
  type = 'text',
  required = false,
  ...props
}, ref) => {
  const inputStyles = `
    w-full px-3 py-2 text-sm
    bg-white border rounded-lg
    transition-all duration-200
    focus:outline-none focus:ring-2 focus:ring-offset-0
    disabled:bg-gray-50 disabled:cursor-not-allowed
    ${error 
      ? 'border-red-300 focus:border-red-500 focus:ring-red-500' 
      : 'border-gray-300 focus:border-gray-900 focus:ring-gray-900'
    }
  `;

  return (
    <div className={`space-y-1 ${containerClassName}`}>
      {label && (
        <label className="block text-sm font-medium text-gray-700">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <input
        ref={ref}
        type={type}
        className={`${inputStyles} ${className}`}
        {...props}
      />
      {error && (
        <p className="text-xs text-red-600">{error}</p>
      )}
      {helperText && !error && (
        <p className="text-xs text-gray-500">{helperText}</p>
      )}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;
