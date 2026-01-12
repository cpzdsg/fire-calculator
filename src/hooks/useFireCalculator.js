import { useMemo } from 'react';

export function useFireCalculator(assets, income, expense, yieldRate, targetAmount) {
  return useMemo(() => {
    // --- 1. 数据清洗 ---
    const numAssets = Number(assets) || 0;
    const numIncome = Number(income) || 0;
    const numExpense = Number(expense) || 0;
    const numTarget = Number(targetAmount) || 0;
    const numYield = Number(yieldRate) || 0;

    const annualSavings = (numIncome - numExpense) * 12;
    const annualReturnRate = numYield / 100;

    // --- 2. ★ 核心逻辑：先算出"躺赚红线" ---
    // 被动收入(年) = 资产 * 收益率
    // 被动收入(月) = 被动收入(年) / 12
    const passiveIncomeMonthly = (numAssets * annualReturnRate) / 12;

    // --- 3. 初始化 ---
    let currentBalance = numAssets;
    let years = 0;
    const maxYears = 100; // 循环上限，防止死循环
    
    // 初始化图表
    let chartData = [{ 
      year: 0, 
      name: '现在', 
      assets: currentBalance, 
      amount: currentBalance 
    }]; 

    // --- 4. ★ 自由判定：只看"月支出"是否小于"躺赚红线" ---
    const isFree = numExpense > 0 && numExpense <= passiveIncomeMonthly;

    if (isFree) {
      return {
        years: 0,
        finalAssets: currentBalance,
        isInfinite: false,
        status: 'FREE', 
        message: '自由',
        isServing: false,
        safeMonthlyIncome: passiveIncomeMonthly, 
        chartData: [{ 
          year: 0, 
          name: '自由', 
          assets: currentBalance, 
          amount: currentBalance 
        }]
      };
    }

    // --- 5. ★ 新增：检查月支出 > 月收入 且 利息填补不了缺口 ---
    // 如果月支出 > 月收入，计算年利息是否能填补缺口
    if (numExpense > numIncome && numAssets > 0) {
      const monthlyDeficit = numExpense - numIncome; // 月度缺口
      const annualDeficit = monthlyDeficit * 12; // 年度缺口
      const annualInterest = numAssets * annualReturnRate; // 年度利息收入
      
      // 如果年度利息收入 < 年度缺口，说明利息填补不了缺口
      if (annualInterest < annualDeficit) {
        return {
          years: 999,
          finalAssets: currentBalance,
          isInfinite: true,
          status: 'LIFE_SENTENCE',
          message: '999 年',
          isServing: true,
          chartData: []
        };
      }
    }

    // --- 6. 如果没自由，计算还要坐多久牢 (复利循环) ---
    // 只有当目标金额有效时才算
    if (numTarget > 0) {
      while (currentBalance < numTarget && years < maxYears) {
        const investmentIncome = currentBalance * annualReturnRate;
        const nextBalance = currentBalance + annualSavings + investmentIncome;

        // 无期徒刑判定：如果余额在减少且无法达到目标
        if (nextBalance < currentBalance && currentBalance < numTarget) {
          return {
            years: 999,
            finalAssets: currentBalance,
            isInfinite: true,
            status: 'LIFE_SENTENCE',
            message: '999 年',
            isServing: true,
            chartData: chartData
          };
        }

        currentBalance = nextBalance;
        years++;
        
        // 记录图表数据点
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

    // --- 7. 结果封装 ---
    // 如果达到循环上限仍未达到目标
    if (years >= maxYears && currentBalance < numTarget) {
      return {
        years: 999,
        finalAssets: currentBalance,
        isInfinite: true,
        status: 'CALCULATED',
        message: '999 年',
        isServing: true,
        chartData: chartData
      };
    }

    // 正常计算结果
    return {
      years: years,
      finalAssets: currentBalance,
      isInfinite: false,
      status: 'CALCULATED',
      message: `${years} 年`,
      isServing: true,
      chartData: chartData
    };

  }, [assets, income, expense, yieldRate, targetAmount]);
}
