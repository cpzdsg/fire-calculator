import { useMemo } from 'react';

/**
 * 计算资产预测数据（未来30-40年）
 */
export function useAssetProjection(assets, income, expense, yieldRate, targetAmount, yearsToFreedom) {
  return useMemo(() => {
    const annualSavings = (income - expense) * 12;
    const annualReturnRate = yieldRate / 100;
    const projectionYears = 40;
    
    let currentBalance = assets;
    const data = [];
    
    // 如果已经达到自由
    if (yearsToFreedom === 0) {
      data.push({
        year: 0,
        assets: Math.round(assets),
      });
    } else {
      // 计算到自由时的资产（每5年记录一次）
      for (let year = 0; year < yearsToFreedom && year < projectionYears; year++) {
        const investmentIncome = currentBalance * annualReturnRate;
        currentBalance = currentBalance + annualSavings + investmentIncome;
        
        // 记录关键年份：第1年、每5年、达到目标的那一年
        if (year === 0 || (year + 1) % 5 === 0 || year === yearsToFreedom - 1) {
          data.push({
            year: year + 1,
            assets: Math.round(currentBalance),
          });
        }
      }
    }
    
    const balanceAtFreedom = currentBalance;
    
    // 继续计算自由后的资产增长（假设每年取4%用于生活，剩余的继续复利）
    const annualWithdrawal = targetAmount * 0.04; // 年度支出（目标金额的4%，符合FIRE原则）
    
    for (let year = yearsToFreedom; year < projectionYears; year++) {
      const investmentIncome = currentBalance * annualReturnRate;
      // 自由后：投资收益 - 年度支出（取4%规则）
      currentBalance = currentBalance + investmentIncome - annualWithdrawal;
      
      // 记录关键年份：达到自由的那一年、每5年
      if (year === yearsToFreedom || (year + 1) % 5 === 0 || year === projectionYears - 1) {
        data.push({
          year: year + 1,
          assets: Math.round(currentBalance),
        });
      }
    }
    
    // 计算自由后的年化增长率（基于20年的数据）
    let growthRate = 0;
    if (yearsToFreedom < projectionYears && balanceAtFreedom > 0) {
      const yearsAfterFreedom = Math.min(20, projectionYears - yearsToFreedom);
      if (yearsAfterFreedom > 0) {
        const finalBalance = currentBalance;
        // 计算年化增长率：(最终/初始)^(1/年数) - 1
        if (finalBalance > balanceAtFreedom) {
          growthRate = ((finalBalance / balanceAtFreedom) ** (1 / yearsAfterFreedom) - 1) * 100;
        } else {
          growthRate = ((finalBalance / balanceAtFreedom) ** (1 / yearsAfterFreedom) - 1) * 100;
        }
      }
    }
    
    return {
      data,
      growthRate,
      finalBalance: currentBalance,
      balanceAtFreedom,
    };
  }, [assets, income, expense, yieldRate, targetAmount, yearsToFreedom]);
}
