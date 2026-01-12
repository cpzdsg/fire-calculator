/**
 * 极简版工具函数
 */

// 1. 简单的类名合并函数
export function cn(...classes) {
  return classes.filter(Boolean).join(' ');
}

// 2. 核心功能：支持多币种转换的金额格式化
export function formatCurrency(value, lang = 'zh') {
  const currencySymbol = lang === 'en' ? '$' : '¥';
  
  return `${currencySymbol}${new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value)}`;
}

// 3. 极简版单位提示：仅保留单字单位
export function formatAmountHint(value, lang = 'zh') {
  if (!value || isNaN(value)) return '';
  const num = parseFloat(value);
  
  // 基础单位不需要显示
  if (num < 1000) return '';

  if (lang === 'zh') {
    // 中文逻辑：万、亿
    if (num >= 100000000) return '亿';
    if (num >= 10000) return '万';
    return '千';
  } else {
    // 英文逻辑：K, M, B
    if (num >= 1000000000) return 'B';
    if (num >= 1000000) return 'M';
    return 'K';
  }
}