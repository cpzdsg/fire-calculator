import { useMemo } from 'react';

export function useFireCalculator(assets, income, expense, yieldRate, targetAmount) {
  return useMemo(() => {
    // --- 1. 数据清洗 ---
    const numAssets = Number(assets) || 0;
    const numIncome = Number(income) || 0;
    const numExpense = Number(expense) || 0;
    const numTarget = Number(targetAmount) || 0; // 这里的target通常是月支出*12*25，但在新逻辑下我们主要看被动收入
    const numYield = Number(yieldRate) || 0;

    const annualSavings = (numIncome - numExpense) * 12;
    const annualReturnRate = numYield / 100;

    // --- 2. ★ 你的核心逻辑：先算出“躺赚红线” ---
    // 被动收入(年) = 资产 * 收益率
    // 被动收入(月) = 被动收入(年) / 12
    const passiveIncomeMonthly = (numAssets * annualReturnRate) / 12;

    // --- 3. 初始化 ---
    let currentBalance = numAssets;
    let years = 0;
    const maxYears = 100;
    
    // 初始化图表
    let chartData = [{ 
      year: 0, 
      name: '现在', 
      assets: currentBalance, 
      amount: currentBalance 
    }]; 

    // --- 4. ★ 自由判定：只看“月支出”是否小于“躺赚红线” ---
    // 逻辑：只要你的月支出 <= 你资产产生的月利息，你就自由了
    // 注意：这里我们不放烟花，只标记状态为 FREE。放烟花的时机交给前端的延时器。
    const isFree = numExpense > 0 && numExpense <= passiveIncomeMonthly;

    if (isFree) {
      return {
        years: 0,
        status: 'FREE', 
        message: '自由',
        isServing: false,
        // 算出这个“躺赚红线”是多少，方便以后展示
        safeMonthlyIncome: passiveIncomeMonthly, 
        chartData: [{ 
          year: 0, 
          name: '自由', 
          assets: currentBalance, 
          amount: currentBalance 
        }]
      };
    }

    // --- 5. 如果没自由，计算还要坐多久牢 (复利循环) ---
    // 只有当目标金额有效时才算
    if (numTarget > 0) {
      while (currentBalance < numTarget && years < maxYears) {
        const investmentIncome = currentBalance * annualReturnRate;
        const nextBalance = currentBalance + annualSavings + investmentIncome;

        // 无期徒刑判定
        if (nextBalance < currentBalance && currentBalance < numTarget) {
          return {
            years: Infinity,
            status: 'LIFE_SENTENCE',
            message: '无期徒刑',
            isServing: true,
            chartData: [] 
          };
        }

        currentBalance = nextBalance;
        years++;
        
        if (years <= 10 || years % 5 === 0 || currentBalance >= numTarget) {
           chartData.push({
              year: years,
              name: `${years}年后`,
              assets: Math.round(currentBalance),
              amount: Math.round(currentBalance)
           });
        }
      }
    }

    // --- 6. 结果封装 ---
    return {
      years: years,
      status: 'CALCULATED',
      message: years >= maxYears ? '100+ 年' : `${years} 年`,
      isServing: true,
      chartData: chartData
    };

  }, [assets, income, expense, yieldRate, targetAmount]);
}