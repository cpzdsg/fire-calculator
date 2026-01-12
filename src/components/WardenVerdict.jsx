import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Lock, Crown, Zap } from 'lucide-react';

export const WardenVerdict = ({ result }) => {
  let title, text, borderColor, bgColor, icon;

  // 严格按照年数判定，解决文案错位
  if (result.years <= 3) {
    title = '🔓 即将假释 (Freedom)';
    text = '典狱长已经在写你的推荐信了。自由的味道就在门口，收拾好行李，别回头。';
    icon = <Zap className="w-6 h-6 text-emerald-400" />;
    borderColor = 'border-emerald-500/50';
    bgColor = 'bg-emerald-500/10';
  } else if (result.years <= 10) {
    title = '🛡️ 表现良好 (Model Prisoner)';
    text = '你是个模范犯人。复利确实在帮你挖地道，虽然进度不算快，但至少你能看到光了。';
    icon = <Shield className="w-6 h-6 text-blue-400" />;
    borderColor = 'border-blue-500/50';
    bgColor = 'bg-blue-500/10';
  } else if (result.years <= 25) {
    title = '🧱 刑期漫长 (Long Sentence)';
    text = '别看复利了。那点收益还没你的饭钱多。建议在牢里学点手艺，监狱里的饭管饱，日子还长。';
    icon = <Lock className="w-6 h-6 text-orange-400" />;
    borderColor = 'border-orange-500/50';
    bgColor = 'bg-orange-500/10';
  } else {
    title = '🔒 终身监禁 (Life Sentence)';
    text = '复利？那是老板买法拉利的复利。监狱就是你的家。建议把床位打扫干净点，这辈子你就住这了。';
    icon = <Crown className="w-6 h-6 text-red-500" />;
    borderColor = 'border-red-500/50';
    bgColor = 'bg-red-500/10';
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`mt-6 p-6 border-2 rounded-2xl shadow-lg transition-all ${borderColor} ${bgColor}`}
    >
      <div className="flex items-center gap-3 mb-3">
        {icon}
        <h3 className="text-xl font-black italic tracking-tight">{title}</h3>
      </div>
      <p className="text-gray-300 leading-relaxed font-medium">
        {text}
      </p>
    </motion.div>
  );
};