import React from 'react';

export function Input({ 
  type = 'text', 
  placeholder, 
  value, 
  onChange, 
  disabled = false,
  className = '', 
  ...props 
}) {
  return (
    <input
      type={type}
      placeholder={placeholder}
      value={value || ''}
      onChange={(e) => onChange(e.target.value)}
      disabled={disabled}
      className={`
        w-full px-4 py-3 
        bg-slate-800 border border-slate-700 
        rounded-lg 
        text-white placeholder-gray-500
        focus:outline-none focus:border-neon-green focus:ring-1 focus:ring-neon-green
        disabled:opacity-50 disabled:cursor-not-allowed
        transition-colors
        ${className}
      `}
      {...props}
    />
  );
}
// 触发更新
