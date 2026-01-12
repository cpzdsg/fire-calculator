import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { InputCard } from './components/InputCard';
import { Slider } from './components/Slider';
import { ResultDisplay } from './components/ResultDisplay'; 
import { AssetsChart } from './components/AssetsChart';
import { useFireCalculator } from './hooks/useFireCalculator';
import { formatCurrency } from './lib/utils';
import { locales } from './locales';

function App() {
  // 1. 自动识别浏览器语言：确保全球用户打开即对应母语
  const [lang, setLang] = useState(() => {
    if (typeof window !== 'undefined') {
      const browserLang = navigator.language || navigator.userLanguage;
      return browserLang?.toLowerCase().startsWith('zh') ? 'zh' : 'en';
    }
    return 'zh';
  });

  const t = locales[lang];
  const [assets, setAssets] = useState('');
  const [income, setIncome] = useState('');
  const [expense, setExpense] = useState('');
  const [yieldRate, setYieldRate] = useState(3.5);
  const [targetAmount, setTargetAmount] = useState(0);
  const [isEditingTarget, setIsEditingTarget] = useState(false);

  // SEO 动态埋点与 JSON-LD
  useEffect(() => {
    const isZh = lang === 'zh';
    document.title = isZh 
      ? "赎身计算器 - 算出你离财务自由还有多远 | FIRE Calculator" 
      : "Buy Freedom - FIRE Calculator | When can you quit?";

    const schemaData = {
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      "name": isZh ? "赎身计算器" : "Buy Freedom Calculator",
      "operatingSystem": "Web",
      "applicationCategory": "FinanceApplication",
      "description": isZh 
        ? "专为社畜、程序员、数字游民打造的 FIRE 退休计算器。算法包含复利效应，算出你的真实赎身日期。" 
        : "A brutal FIRE calculator for the daily grind. Calculate your sentence and plan your escape from the rat race."
    };

    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.innerHTML = JSON.stringify(schemaData);
    document.head.appendChild(script);

    return () => {
      document.head.removeChild(script);
    };
  }, [lang]);

  // 自动计算赎身目标（25倍原则）
  useEffect(() => {
    const expenseNum = parseFloat(expense) || 0;
    const calculatedTarget = expenseNum * 12 * 25;
    if (!isEditingTarget) {
      setTargetAmount(calculatedTarget);
    }
  }, [expense, isEditingTarget]);

  const assetsNum = parseFloat(assets) || 0;
  const incomeNum = parseFloat(income) || 0;
  const expenseNum = parseFloat(expense) || 0;
  const targetNum = targetAmount || 0;
  const result = useFireCalculator(assetsNum, incomeNum, expenseNum, yieldRate, targetNum);

  const handleShare = () => {
    const years = result.years;
    const progress = Math.min(Math.round((assetsNum / targetNum) * 100), 100) || 0;
    const baseUrl = "https://www.buy-freedom.xyz";
    const isZh = lang === 'zh';
    
    let soulQuote = isZh 
      ? (years === 0 ? "躺到老，爽到老。" : years <= 15 ? "夜里想了千条路，早起还得磨豆腐。" : "复利？我看是老板的法拉利。")
      : (years === 0 ? "Stay free." : "Compounding your boss's Ferrari.");

    const shareText = isZh 
      ? `⚖️ 宣判结果：我距离刑满释放还需 ${years === 999 ? '无限' : years} 年！\n💬 典狱长寄语：${soulQuote}\n💰 赎身目标：${formatCurrency(targetNum, 'zh')}\n🚧 目前进度：${progress}%\n\n👉 快来算出你的刑期：${baseUrl}`
      : `⚖️ Verdict: ${years === 999 ? 'Infinite' : years} years left in this cell!\n💬 Warden: ${soulQuote}\n💰 Target: ${formatCurrency(targetNum, 'en')}\n🚧 Progress: ${progress}%\n\n👉 When can you quit? Check here: ${baseUrl}`;

    if (navigator.share) {
      navigator.share({ title: 'Buy Freedom', text: shareText }).catch(() => {});
    } else {
      navigator.clipboard.writeText(shareText);
      alert(isZh ? '判决书已复制' : 'Verdict Copied');
    }
  };

  return (
    <main className="min-h-screen bg-black text-white p-4 md:p-8 font-sans">
      <div className="max-w-4xl mx-auto">
        {/* 顶部布局与你的逻辑保持一致，仅优化了平滑度 */}
        <div className="flex justify-end mb-4">
          <button 
            onClick={() => setLang(lang === 'zh' ? 'en' : 'zh')} 
            className="text-xs font-mono border border-slate-700 px-3 py-1 rounded-full hover:bg-slate-800 transition-colors text-slate-400"
          >
            {lang === 'zh' ? 'English' : '中文'}
          </button>
        </div>

        <header className="text-center mb-8">
          <div className="flex items-center justify-center gap-4 mb-4">
            <img src="/peon.jpg" className="w-14 h-14 rounded-full border-2 border-gray-600 shadow-xl object-cover" alt="Peon" />
            <h1 className="text-4xl md:text-5xl font-black tracking-tighter">
              {t.title} <span className="text-red-600">{t.subtitle}</span> {t.calcName}
            </h1>
          </div>
          <p className="text-gray-400 font-mono text-sm">{t.headerDesc}</p>
          <section className="text-xs text-gray-400 max-w-2xl mx-auto px-4 mt-6 bg-slate-900/50 py-4 rounded-xl border border-slate-800">
            <p className="mb-2 text-gray-300 font-bold">{t.ruleTitle}</p>
            <p>{t.ruleDesc}</p>
            <p className="mt-2 text-red-500 font-mono">{t.ruleAlgo}</p>
          </section>
        </header>

        {/* ... 输入区域和 Slider 逻辑保持不变 ... */}
        {/* 下面这一行修正了你之前反馈的数值显示问题 */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <InputCard label={t.labelAssets} placeholder={t.placeholderAssets} value={assets} onChange={setAssets} lang={lang} />
          <InputCard label={t.labelIncome} placeholder={t.placeholderIncome} value={income} onChange={setIncome} lang={lang} />
          <InputCard label={t.labelExpense} placeholder={t.placeholderExpense} value={expense} onChange={setExpense} lang={lang} />
          <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-4 flex flex-col justify-center">
            <Slider label={t.labelYield} value={yieldRate} onChange={setYieldRate} min={0} max={50} step={0.1} />
            <div className="mt-4 pt-4 border-t border-slate-800">
              <p className="text-xs text-slate-500 mb-2 font-mono">{t.presetLabel}</p>
              <div className="grid grid-cols-2 gap-2">
                {t.presets.map((preset, index) => (
                  <button 
                    key={index} 
                    onClick={() => setYieldRate(preset.rate)} 
                    className={`${preset.color} hover:opacity-80 transition-opacity p-2 rounded-lg border border-slate-700/50 text-left group`}
                  >
                    <div className="text-xs text-slate-300 font-bold group-hover:text-white">{preset.desc}</div>
                    <div className="text-[10px] text-slate-500">{preset.label}</div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* 结果显示区 */}
        {expenseNum > 0 && (
          <section className="bg-slate-900/50 border border-slate-800 rounded-3xl overflow-hidden mb-12 shadow-2xl">
            <ResultDisplay result={result} lang={lang} />
            <div className="px-6 pb-8 pt-0 border-t border-dashed border-slate-800/50">
               <div className="mt-6">
                 <AssetsChart 
                    targetAmount={targetNum} 
                    currentAssets={assetsNum} 
                    monthlySavings={incomeNum - expenseNum} 
                    yieldRate={yieldRate} 
                    lang={lang}
                  />
               </div>
               <div className="mt-10 flex flex-col items-center">
                 <button 
                   onClick={handleShare}
                   className="px-10 py-4 rounded-xl bg-white/5 border border-slate-700 hover:border-emerald-500/50 hover:bg-white/10 transition-all group shadow-xl"
                 >
                   <div className="flex items-center gap-3 text-slate-200 group-hover:text-emerald-400">
                     <span className="text-sm font-bold tracking-widest uppercase">
                       {lang === 'zh' ? '分享我的刑期' : 'SHARE MY SENTENCE'}
                     </span>
                     <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                     </svg>
                   </div>
                 </button>
               </div>
            </div>
          </section>
        )}
      </div>
    </main>
  );
}

export default App;