import React from 'react';
import { motion } from 'framer-motion';
import { WardenVerdict } from './WardenVerdict';

export function ResultDisplay({ result, lang = 'zh' }) {
  if (!result || typeof result.years === 'undefined') return null;

  const { years, isInfinite } = result;

  const getStatusColor = () => {
    if (isInfinite) return 'text-red-600';
    if (years === 0) return 'text-emerald-500'; 
    if (years <= 5) return 'text-yellow-500';   
    return 'text-red-600';                      
  };

  const labels = {
    zh: { sentence: "剩余刑期", years: "年", infinite: "终身监禁" },
    en: { sentence: "REMAINING SENTENCE", years: "Years", infinite: "LIFE SENTENCE" }
  };
  
  const text = labels[lang] || labels.zh;
  const statusColor = getStatusColor();

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="p-8 text-center"
    >
      <h3 className="text-slate-500 uppercase tracking-widest text-sm mb-4">
        {text.sentence}
      </h3>
      
      {/* 修正：将 gap-8 改为 gap-3，拉近数字与年份单位的距离 */}
      <div className={`flex items-baseline justify-center gap-3 mb-8 tracking-tighter font-black ${statusColor}`}>
        <span className="text-8xl md:text-9xl leading-none">
          {isInfinite ? text.infinite : years}
        </span>
        
        {!isInfinite && (
          <span className="text-3xl md:text-5xl opacity-90 font-bold">
            {text.years}
          </span>
        )}
      </div>

      <WardenVerdict years={isInfinite ? 999 : years} lang={lang} />
    </motion.div>
  );
}