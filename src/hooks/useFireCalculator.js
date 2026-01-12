/**
 * 核心逻辑：计算赎身所需年数
 * 增加了“死循环”防护逻辑，防止浏览器黑屏
 */
export const useFireCalculator = (assets, income, expense, yieldRate, target) => {
  // 月度结余转为年度结余
  const annualSavings = (income - expense) * 12;
  const rate = yieldRate / 100;
  
  let years = 0;
  let currentAssets = assets;

  // 1. 【安全判定】如果收入小于支出，且现有资产产生的利息也填不补缺口
  // 这种情况下，资产会不断缩水，永远无法达到目标。
  if (annualSavings <= 0 && (currentAssets * rate) <= Math.abs(annualSavings)) {
    return { 
      years: 999, 
      isInfinite: true, 
      finalAssets: currentAssets 
    };
  }

  // 2. 【计算循环】增加 100 年的上限，防止因极端数据导致的死循环
  // 即使复利再强，普通社畜也很少能服役超过 100 年。
  while (currentAssets < target && years < 100) {
    // 每一年的公式：(当前资产 * 收益率) + 今年的结余
    currentAssets = (currentAssets * (1 + rate)) + annualSavings;
    years++;
    
    // 如果资产在计算过程中跌破 0（由于入不敷出），直接判定为终身监禁
    if (currentAssets < 0) {
      years = 999;
      break;
    }
  }

  // 如果循环次数达到了 100 年，也视为“终身监禁”级别
  const finalYears = years >= 100 ? 999 : years;

  return { 
    years: finalYears, 
    finalAssets: currentAssets,
    isInfinite: finalYears === 999
  };
};