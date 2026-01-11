import React from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, Shield, Crown } from 'lucide-react';

export function WardenVerdict({ growthRate, yearsToFreedom }) {
  // 只有在达到自由后才显示判决
  if (yearsToFreedom === Infinity || yearsToFreedom > 100) {
    return null;
  }

  let tier = null;
  let title = '';
  let text = '';
  let icon = null;
  let borderColor = '';
  let bgColor = '';

  // 判断层级（基于自由后的资产年化增长率）
  if (growthRate < 2) {
    // Tier 1: 假释观察
    tier = 1;
    title = '⚠️ 假释观察 (Parole)';
    text = '虽然你自由了，但抗风险能力较弱。一场大病可能让你重回牢房。建议继续靠手艺赚点外快。';
    icon = <AlertTriangle className="w-6 h-6 text-yellow-400" />;
    borderColor = 'border-yellow-400/50';
    bgColor = 'bg-yellow-400/10';
  } else if (growthRate >= 2 && growthRate <= 5) {
    // Tier 2: 无罪释放
    tier = 2;
    title = '🛡️ 无罪释放 (Freedom)';
    text = '你的被动收入非常稳健。只要不沾染黄赌毒，这辈子都不用再打工了。';
    icon = <Shield className="w-6 h-6 text-neon-green" />;
    borderColor = 'border-neon-green/50';
    bgColor = 'bg-neon-green/10';
  } else {
    // Tier 3: 收购监狱
    tier = 3;
    title = '👑 收购监狱 (Kingpin)';
    text = '你的复利效应太恐怖了！20年后你的资产将翻倍。你可以考虑买下监狱，雇老板给你打工。';
    icon = <Crown className="w-6 h-6 text-neon-yellow" />;
    borderColor = 'border-neon-yellow/50';
    bgColor = 'bg-neon-yellow/10';
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className={`mt-6 border-2 ${borderColor} ${bgColor} rounded-xl p-6`}
    >
      <div className="flex items-start gap-4">
        <div className="flex-shrink-0 mt-1">
          {icon}
        </div>
        <div className="flex-1">
          <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
          <p className="text-gray-300 leading-relaxed">{text}</p>
        </div>
      </div>
    </motion.div>
  );
}
