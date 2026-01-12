export const locales = {
  zh: {
    title: "社畜",
    subtitle: "刑期",
    calcName: "计算器",
    // 删掉奇怪的表述，保持头部清爽
    headerDesc: "", 
    ruleTitle: "📜 赎身法则 (FIRE Theory)",
    ruleDesc: "当你攒够【年度开销的 25 倍】本金，靠理财收益即可覆盖生存所需。",
    ruleAlgo: "算法：目标金额 - 现有资产 = 剩余刑期 (已计入复利效应)",
    labelAssets: "现有资产",
    labelIncome: "月均到手",
    labelExpense: "月均支出",
    labelYield: "理财预期年化 (%)",
    labelTarget: "建议赎身总金额 (年支出 × 25)", 
    placeholderAssets: "攒了多少赎金？",
    placeholderIncome: "每月卖身赚多少？",
    placeholderExpense: "生命维持费是多少？",
    presetLabel: "选择您的资产配置方案：",
    presets: [
      { label: "余额宝/货币基金", rate: 1.8, desc: "安全且缓慢 (1.8%)", color: "bg-slate-700" },
      { label: "国债/定期理财", rate: 2.8, desc: "缓慢增长 (2.8%)", color: "bg-blue-900/50" },
      { label: "标普500/基金定投", rate: 10.0, desc: "高速越狱 (10%)", color: "bg-emerald-900/50" },
      { label: "赌徒博命/币圈", rate: 50.0, desc: "赌徒博命 (50%)", color: "bg-red-900/50" }
    ]
  },
  en: {
    title: "Wage Slave",
    subtitle: "Sentence",
    calcName: "Calculator",
    // 同样删掉英文版对应的表述
    headerDesc: "", 
    ruleTitle: "📜 Parole Rules (FIRE Theory)",
    ruleDesc: "When you save 25 times your annual expenses, investment returns can cover your life.",
    ruleAlgo: "Algo: Target Amount - Current Assets = Remaining Sentence (Compound Interest Included)",
    labelAssets: "Current Assets",
    labelIncome: "Monthly Income",
    labelExpense: "Monthly Expenses",
    labelYield: "Expected Yield (%)",
    labelTarget: "Freedom Fund (Rule of 25)", 
    placeholderAssets: "How much bail money saved?",
    placeholderIncome: "Selling my life for how much?",
    placeholderExpense: "Cost of existence?",
    presetLabel: "Select Your Portfolio (US Market):",
    presets: [
      { label: "HYSA / T-Bills", rate: 4.0, desc: "Safe & Slow (4.0%)", color: "bg-slate-700" },
      { label: "Stocks & Bonds Mix", rate: 7.0, desc: "Steady Growth (7%)", color: "bg-blue-900/50" },
      { label: "S&P 500 Index", rate: 10.0, desc: "Equity Returns (10%)", color: "bg-emerald-900/50" },
      { label: "Crypto / Leverage", rate: 50.0, desc: "Death Wish (50%)", color: "bg-red-900/50" }
    ]
  }
};