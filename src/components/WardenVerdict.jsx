import React from 'react';

/**
 * 严格遵照最终确定的 4 大标题与中英灵魂文案：
 * 1. 生而自由 -> 躺到老，爽到老
 * 2. 最后冲刺 -> 出发不是为了到达，而是为了不再回来
 * 3. 漫长刑期 -> 夜里想了千条路，早起还得磨豆腐 (McJob 梗)
 * 4. 终身监禁 -> 复利？我看是老板的法拉利 (Family 梗)
 */
export const WardenVerdict = ({ years, lang = 'zh' }) => {
  const isEn = lang === 'en';

  const getVerdict = () => {
    // 1. 生而自由 (0年)
    if (years === 0) {
      return {
        status: isEn ? '【BORN FREE】' : '【生而自由】',
        text: isEn ? "Stay free, for the rest of your life." : "躺到老，爽到老。",
        color: 'text-emerald-400'
      };
    }

    // 2. 最后冲刺 (1-5年)
    if (years <= 5) {
      return {
        status: isEn ? '【FINAL STRETCH】' : '【最后冲刺】',
        text: isEn 
          ? "Leaving is not for arriving, but for never coming back." 
          : "出发不是为了到达，而是为了不再回来。",
        color: 'text-yellow-500'
      };
    }

    // 3. 漫长刑期 (5-15年)
    if (years <= 15) {
      return {
        status: isEn ? '【LONG GRIND】' : '【漫长刑期】',
        text: isEn 
          ? "Dreaming of the path at night, flipping burgers at dawn." 
          : "夜里想了千条路，早起还得磨豆腐。",
        color: 'text-orange-500'
      };
    }

    // 4. 终身监禁 (15年以上)
    return {
      status: isEn ? '【LIFE SENTENCE】' : '【终身监禁】',
      text: isEn 
        ? "Compound interest? It's for your boss's Ferrari. Work hard, the company is your home forever." 
        : "复利？我看是老板的法拉利。好好干活吧，公司就是你永远的家。",
      color: 'text-red-600'
    };
  };

  const verdict = getVerdict();

  return (
    <div className="mt-4 p-5 rounded-xl bg-slate-900/90 border border-slate-800 shadow-2xl transition-all duration-300">
      <p className={`text-sm md:text-base font-bold tracking-wide ${verdict.color}`}>
        <span className="opacity-80 mr-3">{verdict.status}</span> 
        <span className="italic">“{verdict.text}”</span>
      </p>
    </div>
  );
};