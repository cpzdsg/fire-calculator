import React from 'react';
import { motion } from 'framer-motion';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine
} from 'recharts';

/**
 * 1. 自定义Tooltip组件
 */
const CustomTooltip = ({ active, payload, label }) => {
  // 安全检查：防止 payload 为空报错
  if (active && payload && payload.length && payload[0].payload) {
    const data = payload[0].payload;
    const isTarget = (data.name || '').includes('自由') || (data.name || '').includes('目标');

    return (
      <div className={`
        border-2 rounded-lg p-3 shadow-lg
        ${isTarget ? 'bg-neon-yellow/20 border-neon-yellow' : 'bg-slate-800/90 border-slate-600'}
        backdrop-blur-sm
      `}>
        <p className={`font-bold mb-1 ${isTarget ? 'text-neon-yellow' : 'text-gray-300'}`}>
          {label}
        </p>
        <p className={`text-xl font-bold ${isTarget ? 'text-neon-yellow' : 'text-neon-green'}`}>
          {new Intl.NumberFormat('zh-CN', {
            style: 'currency',
            currency: 'CNY',
            maximumFractionDigits: 0,
          }).format(data.assets)}
        </p>
        {isTarget && (
          <p className="text-xs text-neon-yellow mt-1">🎉 已达成赎身目标！</p>
        )}
      </div>
    );
  }
  return null;
};

/**
 * 2. 自定义终点 Dot (防崩保护版)
 */
const CustomizedDot = (props) => {
  const { cx, cy, stroke, index, dataPoints } = props;
  
  // 防错：如果没有数据，画个普通点
  if (!dataPoints || dataPoints.length === 0) {
     return <circle cx={cx} cy={cy} r={4} stroke={stroke} strokeWidth={2} fill="#1a1a1a" />;
  }

  const isLast = index === dataPoints.length - 1;

  if (isLast) {
    return (
      <svg x={cx - 8} y={cy - 8} width={16} height={16} fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="8" cy="8" r="8" fill="#FFD700" fillOpacity="0.3" />
        <circle cx="8" cy="8" r="4" fill="#FFD700" stroke="#FFD700" strokeWidth="2" />
        <animate attributeName="r" values="4;6;4" dur="1.5s" repeatCount="indefinite" />
      </svg>
    );
  }

  return (
    <circle cx={cx} cy={cy} r={4} stroke={stroke} strokeWidth={2} fill="#1a1a1a" />
  );
};

/**
 * 3. 主图表组件
 */
export function AssetProjectionChart({ projectionData, targetAmount }) {
  // props 检查
  if (!projectionData || !projectionData.data || projectionData.data.length === 0) {
    return null;
  }

  const { data } = projectionData;

  const formatYAxis = (value) => {
    if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`;
    if (value >= 1000) return `${(value / 1000).toFixed(0)}K`;
    return value;
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.2 }}
      className="mt-8 w-full h-[300px] bg-slate-900/50 rounded-xl p-4 border border-slate-800"
    >
      <h3 className="text-lg text-gray-300 mb-4 pl-2">资产增长预测</h3>
      <ResponsiveContainer width="100%" height="85%">
        <LineChart data={data} margin={{ top: 25, right: 20, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
          
          <XAxis 
            dataKey="name" 
            stroke="#666"
            tick={{ fill: '#999', fontSize: 12 }}
            tickLine={false}
          />
          
          <YAxis 
            stroke="#666"
            tick={{ fill: '#999', fontSize: 12 }}
            tickFormatter={formatYAxis}
            tickLine={false}
            axisLine={false}
          />
          
          <Tooltip 
            content={<CustomTooltip />} 
            cursor={{ stroke: '#666', strokeWidth: 1, strokeDasharray: '3 3' }} 
          />
          
          {/* ★ 目标线配置：回到右侧，但悬浮在上方 */}
          {targetAmount > 0 && (
            <ReferenceLine 
              y={targetAmount} 
              label={{ 
                value: '目标', 
                fill: '#FFD700', 
                fontSize: 12,
                position: 'insideTopRight', // 1. 定位到右侧 (黄点那边)
                dy: -20, // 2. 向上飞 20px (避开圆点)
                dx: -5   // 3. 稍微往左挪一点 (防止贴太紧)
              }} 
              stroke="#FFD700" 
              strokeDasharray="3 3"
              strokeOpacity={0.5}
            />
          )}

          <Line
            type="monotone"
            dataKey="assets"
            stroke="#00ff9d"
            strokeWidth={3}
            dot={<CustomizedDot dataPoints={data} />}
            activeDot={{ r: 6, stroke: '#FFD700', strokeWidth: 2, fill: '#1a1a1a' }}
          />
        </LineChart>
      </ResponsiveContainer>
    </motion.div>
  );
}