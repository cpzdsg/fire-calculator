/**
 * 格式化数字为中文货币格式
 */
export function formatCurrency(value) {
  if (value === null || value === undefined || isNaN(value)) return '¥0';
  return new Intl.NumberFormat('zh-CN', {
    style: 'currency',
    currency: 'CNY',
    maximumFractionDigits: 0,
  }).format(value);
}

/**
 * 格式化数字显示
 */
export function formatNumber(value) {
  if (value === null || value === undefined || isNaN(value)) return '0';
  return new Intl.NumberFormat('zh-CN').format(value);
}

