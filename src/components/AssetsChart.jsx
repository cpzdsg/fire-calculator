import React from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine
} from 'recharts';

const CustomizedDot = (props) => {
  const { cx, cy, payload, targetAmount, firstFreeYear } = props;
  const isFree = payload.amount >= targetAmount;
  const isMomentOfFreedom = payload.year === firstFreeYear;

  if (isMomentOfFreedom) {
    return (
      <svg x={cx - 10} y={cy - 10} width={20} height={20}>
        <defs>
          <filter id="yellow-glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="2.5" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        {/* 外层发光光晕 */}
        <circle cx="10" cy="10" r="5" fill="#facc15" filter="url(#yellow-glow)">
          <animate attributeName="r" values="4.5;6;4.5" dur="2s" repeatCount="indefinite" />
        </circle>
        {/* 核心修正：移除黑色圆圈，改为单一实心黄色圆点 */}
        <circle cx="10" cy="10" r="3.5" fill="#facc15" />
      </svg>
    );
  }

  if (isFree) {
    return <circle cx={cx} cy={cy} r={3} fill="#10b981" stroke="#000" strokeWidth={1} />;
  }

  return <circle cx={cx} cy={cy} r={2.5} stroke="#22d3ee" strokeWidth={1} fill="#0f172a" />;
};

export const AssetsChart = ({ targetAmount, currentAssets, monthlySavings, yieldRate, lang = 'zh' }) => {
  const isEn = lang === 'en';

  const generateData = () => {
    const data = [];
    let assets = currentAssets;
    const annualRate = yieldRate / 100;
    const monthlyRate = annualRate / 12;
    const currentYear = new Date().getFullYear();
    let firstFreeYearFound = null;

    for (let i = 0; i <= 30; i++) {
      const year = currentYear + i;
      data.push({ year, amount: Math.round(assets) });
      if (firstFreeYearFound === null && assets >= targetAmount) {
        firstFreeYearFound = year;
      }
      for (let m = 0; m < 12; m++) {
        assets = assets * (1 + monthlyRate) + monthlySavings;
      }
      if (assets > targetAmount * 2.5) break;
    }
    return { data, firstFreeYear: firstFreeYearFound };
  };

  const { data, firstFreeYear } = generateData();

  return (
    <div className="w-full relative">
      <div className="absolute top-0 left-0 z-10 flex gap-4 text-xs font-mono">
        <div className="flex items-center gap-1.5 text-slate-400">
          <span className="w-2 h-2 rounded-full bg-cyan-400"></span>
          {isEn ? 'Path' : '积累路径'}
        </div>
        <div className="flex items-center gap-1.5 text-emerald-500 font-bold">
          <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
          {isEn ? 'Free' : '自由区'}
        </div>
      </div>

      <div className="h-64 w-full pt-8 overflow-visible">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 5, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="colorAssets" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#22d3ee" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#22d3ee" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
            <XAxis dataKey="year" stroke="#475569" fontSize={10} tickLine={false} axisLine={false} tickMargin={10} />
            <YAxis hide domain={[0, 'auto']} />
            <Tooltip 
               contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '8px', fontSize: '12px', color: '#fff' }}
               itemStyle={{ color: '#22d3ee' }}
            />
            <ReferenceLine 
              y={targetAmount} 
              stroke="#10b981" 
              strokeDasharray="3 3" 
              label={{ 
                value: isEn ? 'FREEDOM LINE' : '赎身线', 
                position: 'insideBottomRight', 
                fill: '#10b981', 
                fontSize: 10,
                fontWeight: 'bold',
                dy: -10 
              }} 
            />
            <Area 
              type="monotone" 
              dataKey="amount" 
              stroke="#22d3ee" 
              strokeWidth={2} 
              fill="url(#colorAssets)" 
              dot={<CustomizedDot targetAmount={targetAmount} firstFreeYear={firstFreeYear} />} 
              isAnimationActive={true}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};