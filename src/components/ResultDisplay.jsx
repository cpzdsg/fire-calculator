import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import confetti from 'canvas-confetti';
import { Calendar, CheckCircle, AlertCircle, Share2 } from 'lucide-react';
import { AssetProjectionChart } from './AssetProjectionChart';
import { WardenVerdict } from './WardenVerdict';

export function ResultDisplay({ result, targetAmount, currentAssets }) {
  // 这里的 confettiTriggered 不再只用来防重复，也用来标记"是否已经炸过了"
  const confettiTriggered = useRef(false);
  const [isCopied, setIsCopied] = useState(false);
  
  // 获取图表数据
  const chartDataArray = result.chartData || [];
  
  const projectionData = {
    data: chartDataArray,
    growthRate: chartDataArray.length > 1 
      ? (chartDataArray[chartDataArray.length - 1].assets / currentAssets - 1) 
      : 0
  };

  const yearsToFreedom = result.years === Infinity ? 100 : result.years;

  // --- ★ 核心修改：带防抖的烟花特效 ---
  useEffect(() => {
    let timer;

    // 只有当状态是 FREE 且 还没炸过时，才进入准备阶段
    if (result.status === 'FREE' && !confettiTriggered.current) {
      
      // 设置 800ms 的引信 (你可以调整这个时间)
      timer = setTimeout(() => {
        // 时间到！开始放烟花
        confettiTriggered.current = true; // 标记已炸，防止后续重复炸
        
        const duration = 3000;
        const animationEnd = Date.now() + duration;
        const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 9999 };

        function randomInRange(min, max) {
          return Math.random() * (max - min) + min;
        }

        const interval = setInterval(function() {
          const timeLeft = animationEnd - Date.now();
          if (timeLeft <= 0) return clearInterval(interval);

          const particleCount = 50 * (timeLeft / duration);
          confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } });
          confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } });
        }, 250);
        
      }, 800); // <--- 这里就是那个"让子弹飞一会儿"的时间
    } 
    
    // 如果状态变回了"服刑中" (比如你把数字改大了)，重置开关
    // 这样下次再变回 Free 时还能再炸
    else if (result.status !== 'FREE') {
      confettiTriggered.current = false;
    }

    // 清理函数：如果用户还在打字（导致 result 变化/组件重渲染），掐灭上一根引信
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [result.status]); // 依赖项：只有状态变了才触发逻辑

  // --- 样式逻辑 ---
  const getDisplayColor = () => {
    if (result.status === 'FREE') return 'text-neon-green text-shadow-neon-green';
    if (result.status === 'LIFE_SENTENCE') return 'text-neon-red text-shadow-neon-red';
    return 'text-gray-300';
  };

  const getIcon = () => {
    if (result.status === 'FREE') return <CheckCircle className="w-8 h-8 text-neon-green" />;
    if (result.status === 'LIFE_SENTENCE') return <AlertCircle className="w-8 h-8 text-neon-red" />;
    return <Calendar className="w-8 h-8 text-gray-400" />;
  };

  // --- 复制功能 ---
  const copyToClipboardFallback = (text) => {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.position = 'fixed';
    textarea.style.left = '-999999px';
    textarea.style.top = '-999999px';
    document.body.appendChild(textarea);
    textarea.focus();
    textarea.select();
    try {
      const successful = document.execCommand('copy');
      document.body.removeChild(textarea);
      return successful;
    } catch (err) {
      document.body.removeChild(textarea);
      throw err;
    }
  };

  const handleCopyResult = async () => {
    let resultText = '';
    if (result.status === 'FREE') {
      resultText = '⚖️ 宣判结果：我已刑满释放，重获自由！';
    } else if (result.status === 'LIFE_SENTENCE') {
      resultText = '⚖️ 宣判结果：我被判无期徒刑！';
    } else {
      const years = result.years || 0;
      resultText = `⚖️ 宣判结果：我距离刑满释放还需 ${years}年！`;
    }

    const progress = targetAmount > 0 
      ? Math.round((currentAssets / targetAmount) * 100) 
      : 0;
    
    const targetFormatted = new Intl.NumberFormat('zh-CN', {
      style: 'currency',
      currency: 'CNY',
      maximumFractionDigits: 0,
    }).format(targetAmount);

    const shareText = `${resultText}
💰 赎身目标：${targetFormatted}
🚧 目前进度：${progress}%
👉 你也要坐牢吗？快来算算：${window.location.origin}`;

    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(shareText);
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
      } else {
        const success = copyToClipboardFallback(shareText);
        if (success) {
          setIsCopied(true);
          setTimeout(() => setIsCopied(false), 2000);
        } else {
          alert('复制功能不可用，请手动复制文本');
        }
      }
    } catch (err) {
      console.error('复制失败:', err);
      try {
        const success = copyToClipboardFallback(shareText);
        if (success) {
          setIsCopied(true);
          setTimeout(() => setIsCopied(false), 2000);
        }
      } catch (fallbackErr) {
        alert('复制功能不可用，请手动复制文本');
      }
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-slate-900/70 border-2 border-slate-800 rounded-xl p-8"
    >
      <div className="flex flex-col items-center space-y-4 text-center">
        <motion.div
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ repeat: Infinity, duration: 2 }}
        >
          {getIcon()}
        </motion.div>
        
        <div className="space-y-2">
          <h2 className="text-lg text-gray-400">剩余刑期</h2>
          <motion.div
            key={result.years !== undefined ? result.years : result.months}
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            className={`text-5xl font-bold ${getDisplayColor()}`}
          >
            {result.message}
          </motion.div>
        </div>

        {/* 目标金额提示 */}
        {result.status !== 'INPUTTING' && (
          <div className="text-sm text-gray-500 mt-4">
            <p>目标金额：{new Intl.NumberFormat('zh-CN', {
              style: 'currency',
              currency: 'CNY',
              maximumFractionDigits: 0,
            }).format(targetAmount)}</p>
          </div>
        )}
      </div>

      {/* 资产曲线图 */}
      {(result.status === 'CALCULATED' || result.status === 'FREE') && chartDataArray.length > 0 && (
        <AssetProjectionChart 
          projectionData={projectionData} 
          targetAmount={targetAmount} 
        />
      )}

      {/* 狱长评语 */}
      {(result.status === 'CALCULATED' || result.status === 'FREE') && yearsToFreedom !== Infinity && yearsToFreedom <= 100 && (
        <WardenVerdict 
          growthRate={projectionData.growthRate}
          yearsToFreedom={yearsToFreedom}
          status={result.status}
          isServing={result.isServing}
        />
      )}

      {/* 分享按钮 */}
      {(result.status === 'CALCULATED' || result.status === 'FREE' || result.status === 'LIFE_SENTENCE') && (
        <div className="flex justify-center mt-6">
          <motion.button
            onClick={handleCopyResult}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`
              px-6 py-3 rounded-lg font-medium
              border-2 transition-all duration-200
              flex items-center gap-2
              ${isCopied 
                ? 'bg-neon-green/20 border-neon-green text-neon-green' 
                : 'bg-transparent border-neon-yellow text-neon-yellow hover:bg-neon-yellow/10 hover:shadow-lg hover:shadow-neon-yellow/50'
              }
            `}
          >
            {isCopied ? (
              <>
                <CheckCircle className="w-5 h-5" />
                <span>✅ 已复制，快去发朋友圈</span>
              </>
            ) : (
              <>
                <Share2 className="w-5 h-5" />
                <span>📢 告诉狱友 (复制结果)</span>
              </>
            )}
          </motion.button>
        </div>
      )}
    </motion.div>
  );
}