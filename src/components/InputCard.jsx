import React from 'react';
import { Input } from './Input';

export function InputCard({ label, placeholder, value, onChange, type = 'number', editable = true }) {
  return (
    <div className="bg-slate-900/50 border border-slate-800 rounded-lg p-4 hover:border-slate-700 transition-colors">
      <label className="block text-sm font-medium text-gray-300 mb-2">
        {label}
      </label>
      <Input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        disabled={!editable}
        className={!editable ? 'cursor-pointer' : ''}
      />
    </div>
  );
}

