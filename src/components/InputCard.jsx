import React from 'react';
import { Input } from './Input';
import { formatAmountHint } from '../lib/utils'; // 引入刚才新增的工具函数

export function InputCard({ label, placeholder, value, onChange, type = 'number', editable = true, lang = 'zh' }) {
  // 获取格式化后的提示文字
  const hint = formatAmountHint(value, lang);

  return (
    <div className="bg-slate-900/50 border border-slate-800 rounded-lg p-4 hover:border-slate-700 transition-colors">
      <label className="block text-sm font-medium text-gray-300 mb-2">
        {label}
      </label>
      <div className="space-y-1">
        <Input
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          disabled={!editable}
          className={!editable ? 'cursor-pointer' : ''}
        />
        
        {/* 核心修正：移除 ≈ 符号，降低颜色亮度，仅在有单位返回时渲染 */}
        {value && type === 'number' && hint && (
          <div className="text-[10px] font-mono text-slate-500/80 px-1 italic animate-in fade-in duration-300">
            {hint}
          </div>
        )}
      </div>
    </div>
  );
}