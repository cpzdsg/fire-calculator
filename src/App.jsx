import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { InputCard } from './components/InputCard';
import { Slider } from './components/Slider';
import { ResultDisplay } from './components/ResultDisplay';
import { useFireCalculator } from './hooks/useFireCalculator';
import { formatCurrency } from './lib/utils';
import { Scale } from 'lucide-react';

function App() {
  const [assets, setAssets] = useState('');
  const [income, setIncome] = useState('');
  const [expense, setExpense] = useState('');
  const [yieldRate, setYieldRate] = useState(3.5);
  const [targetAmount, setTargetAmount] = useState(0);
  const [isEditingTarget, setIsEditingTarget] = useState(false);

  // 计算目标金额
  useEffect(() => {
    const expenseNum = parseFloat(expense) || 0;
    const calculatedTarget = expenseNum * 12 * 25;
    if (!isEditingTarget) {
      setTargetAmount(calculatedTarget);
    }
  }, [expense, isEditingTarget]);

  // 获取数值
  const assetsNum = parseFloat(assets) || 0;
  const incomeNum = parseFloat(income) || 0;
  const expenseNum = parseFloat(expense) || 0;
  const targetNum = targetAmount || 0;

  // 计算刑期
  const result = useFireCalculator(assetsNum, incomeNum, expenseNum, yieldRate, targetNum);

  const handleTargetClick = () => {
    setIsEditingTarget(true);
  };

  const handleTargetChange = (value) => {
    setTargetAmount(parseFloat(value) || 0);
  };

  const handleTargetBlur = () => {
    setIsEditingTarget(false);
  };

  return (
    <div className="min-h-screen bg-black text-white p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="flex items-center justify-center gap-3 mb-2">
            <Scale className="w-8 h-8 text-neon-green" />
            <h1 className="text-4xl font-bold">刑期计算器</h1>
          </div>
          <p className="text-gray-400 text-sm mb-4">Financial Debt/Work = Prison Sentence</p>
          <div className="text-xs text-gray-400 max-w-2xl mx-auto px-4">
            <p>📜 赎身法则：根据 FIRE 理论，当你攒够【年度开销的 25 倍】本金，靠理财收益就足以覆盖生活。</p>
            <p className="mt-1">算法逻辑：目标金额 - 现有资产 = 剩余刑期 (已计入复利滚雪球效应)</p>
          </div>
        </motion.div>

        {/* Input Section: The Interrogation Room */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <h2 className="text-xl font-semibold text-gray-300 mb-4 flex items-center gap-2">
            <span className="w-1 h-6 bg-neon-red"></span>
            审讯室
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <InputCard
              label="现有资产 (赎身本金)"
              placeholder="现在兜里有多少赎金？"
              value={assets}
              onChange={setAssets}
            />
            <InputCard
              label="月均到手 (卖身收入)"
              placeholder="每个月卖身能赚多少？"
              value={income}
              onChange={setIncome}
            />
            <InputCard
              label="月均支出 (生命体征维持费)"
              placeholder="维持生命体征每月要花多少？"
              value={expense}
              onChange={setExpense}
            />
            <div className="bg-slate-900/50 border border-slate-800 rounded-lg p-4 hover:border-slate-700 transition-colors">
              <Slider
                label="年化收益率 (复利滚雪球 ❄️)"
                value={yieldRate}
                onChange={setYieldRate}
                min={0}
                max={10}
                step={0.1}
                helperText="注：利息会自动计入下一年本金，利滚利加速赎身"
              />
            </div>
          </div>

          {/* Target Amount Display/Edit */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="bg-slate-900/50 border border-slate-800 rounded-lg p-4"
          >
            <label className="block text-sm font-medium text-gray-300 mb-2">
              建议赎身费
            </label>
            {isEditingTarget ? (
              <input
                type="number"
                value={targetAmount}
                onChange={(e) => handleTargetChange(e.target.value)}
                onBlur={handleTargetBlur}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleTargetBlur();
                  }
                }}
                className="w-full px-4 py-3 bg-slate-800 border border-neon-green rounded-lg text-white focus:outline-none focus:ring-1 focus:ring-neon-green"
                autoFocus
              />
            ) : (
              <div
                onClick={handleTargetClick}
                className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white cursor-pointer hover:border-neon-green transition-colors"
              >
                {formatCurrency(targetAmount)}
              </div>
            )}
            <p className="text-xs text-gray-500 mt-2">
              点击可手动编辑（默认 = 月支出 × 12 × 25）
            </p>
          </motion.div>
        </motion.div>

        {/* Result Display */}
        {expenseNum > 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
          >
            <ResultDisplay 
              result={result} 
              targetAmount={targetNum} 
              currentAssets={assetsNum}
              income={incomeNum}
              expense={expenseNum}
              yieldRate={yieldRate}
            />
          </motion.div>
        )}
      </div>
    </div>
  );
}

export default App;

