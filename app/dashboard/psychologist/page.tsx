'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
} from 'recharts';
import PageTransition from '@/components/PageTransition';
import GlassCard from '@/components/GlassCard';
import {
  Activity,
  Users,
  TrendingUp,
  AlertTriangle,
  Heart,
  Brain,
  Shield,
  Eye,
} from 'lucide-react';

// Aggregated anonymous campus mood data
const weeklyMoodDistribution = [
  { mood: 'Great', count: 145, color: '#22c55e' },
  { mood: 'Good', count: 312, color: '#7c3aed' },
  { mood: 'Neutral', count: 189, color: '#fbbf24' },
  { mood: 'Low', count: 87, color: '#ff6b35' },
  { mood: 'Crisis', count: 12, color: '#ef4444' },
];

const wellnessTrend = [
  { week: 'W1', avgMood: 6.2, engagement: 45, sessions: 120 },
  { week: 'W2', avgMood: 6.5, engagement: 52, sessions: 145 },
  { week: 'W3', avgMood: 6.8, engagement: 58, sessions: 167 },
  { week: 'W4', avgMood: 7.1, engagement: 64, sessions: 189 },
  { week: 'W5', avgMood: 6.9, engagement: 61, sessions: 178 },
  { week: 'W6', avgMood: 7.3, engagement: 68, sessions: 201 },
];

const topConcerns = [
  { topic: 'Academic Stress', mentions: 234, trend: '+12%', color: 'text-ember' },
  { topic: 'Anxiety', mentions: 189, trend: '+5%', color: 'text-red-400' },
  { topic: 'Loneliness', mentions: 145, trend: '-8%', color: 'text-pulse' },
  { topic: 'Sleep Issues', mentions: 112, trend: '+2%', color: 'text-serenity' },
  { topic: 'Self-Esteem', mentions: 98, trend: '-3%', color: 'text-warmth' },
];

const pieColors = ['#22c55e', '#7c3aed', '#fbbf24', '#ff6b35', '#ef4444'];

const summaryCards = [
  {
    label: 'Active Students',
    value: '745',
    change: '+23% this month',
    icon: Users,
    gradient: 'from-nebula to-serenity',
  },
  {
    label: 'Avg Wellness Score',
    value: '7.1',
    change: '+0.4 from last week',
    icon: Heart,
    gradient: 'from-ember to-warmth',
  },
  {
    label: 'Chat Sessions',
    value: '201',
    change: 'This week',
    icon: Brain,
    gradient: 'from-pulse to-aura',
  },
  {
    label: 'Alerts',
    value: '3',
    change: 'Patterns flagged',
    icon: AlertTriangle,
    gradient: 'from-red-500 to-ember',
  },
];

export default function PsychologistDashboard() {
  const [timeRange, setTimeRange] = useState<'6w' | '12w'>('6w');

  return (
    <PageTransition>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-start sm:items-center justify-between mb-8 flex-col sm:flex-row gap-4">
          <div>
            <motion.h1
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-3xl sm:text-4xl font-bold text-white"
            >
              Campus <span className="glow-text">Wellness</span> Dashboard
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-slate-400 mt-2 flex items-center gap-2"
            >
              <Shield className="w-4 h-4" />
              Aggregated anonymous data — no individual identification
            </motion.p>
          </div>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex items-center gap-2 glass px-3 py-2 rounded-xl"
          >
            <Eye className="w-4 h-4 text-slate-400" />
            <span className="text-xs text-slate-400">Professional View</span>
          </motion.div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {summaryCards.map((card, i) => (
            <GlassCard key={card.label} delay={i * 0.1} className="relative overflow-hidden">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-slate-400 mb-1">{card.label}</p>
                  <p className="text-2xl font-bold text-white">{card.value}</p>
                  <p className="text-xs text-emerald-400 mt-1 flex items-center gap-1">
                    <TrendingUp className="w-3 h-3" />
                    {card.change}
                  </p>
                </div>
                <div
                  className={`w-10 h-10 rounded-xl bg-gradient-to-br ${card.gradient} flex items-center justify-center`}
                >
                  <card.icon className="w-5 h-5 text-white" />
                </div>
              </div>
              <div
                className={`absolute -bottom-8 -right-8 w-24 h-24 rounded-full bg-gradient-to-br ${card.gradient} opacity-10 blur-2xl`}
              />
            </GlassCard>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Wellness Trend Chart */}
          <GlassCard className="lg:col-span-2" delay={0.3}>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                  <Activity className="w-5 h-5 text-nebula" />
                  Campus Wellness Trend
                </h3>
                <p className="text-sm text-slate-400 mt-1">
                  Average mood & engagement over time
                </p>
              </div>
              <div className="flex gap-1 glass p-1 rounded-xl">
                <button
                  onClick={() => setTimeRange('6w')}
                  className={`px-3 py-1 rounded-lg text-sm transition-all ${
                    timeRange === '6w'
                      ? 'bg-nebula/30 text-white'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  6W
                </button>
                <button
                  onClick={() => setTimeRange('12w')}
                  className={`px-3 py-1 rounded-lg text-sm transition-all ${
                    timeRange === '12w'
                      ? 'bg-nebula/30 text-white'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  12W
                </button>
              </div>
            </div>
            <div className="h-[280px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={wellnessTrend}>
                  <defs>
                    <linearGradient id="moodGradPsy" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#7c3aed" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#7c3aed" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="engGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.2} />
                      <stop offset="95%" stopColor="#06b6d4" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="week" stroke="#475569" fontSize={12} />
                  <YAxis stroke="#475569" fontSize={12} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'rgba(10,10,15,0.9)',
                      border: '1px solid rgba(255,255,255,0.1)',
                      borderRadius: '12px',
                      backdropFilter: 'blur(20px)',
                    }}
                    labelStyle={{ color: '#fff' }}
                  />
                  <Area
                    type="monotone"
                    dataKey="avgMood"
                    stroke="#7c3aed"
                    strokeWidth={2}
                    fill="url(#moodGradPsy)"
                    name="Avg Mood"
                    dot={{ fill: '#7c3aed', strokeWidth: 0, r: 4 }}
                  />
                  <Area
                    type="monotone"
                    dataKey="engagement"
                    stroke="#06b6d4"
                    strokeWidth={2}
                    fill="url(#engGrad)"
                    name="Engagement %"
                    dot={{ fill: '#06b6d4', strokeWidth: 0, r: 3 }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            <div className="flex items-center gap-4 mt-4 text-xs text-slate-400">
              <span className="flex items-center gap-1.5">
                <div className="w-3 h-0.5 bg-nebula rounded" /> Avg Mood
              </span>
              <span className="flex items-center gap-1.5">
                <div className="w-3 h-0.5 bg-aura rounded" /> Engagement
              </span>
            </div>
          </GlassCard>

          {/* Mood Distribution Pie */}
          <GlassCard delay={0.4}>
            <h3 className="text-lg font-semibold text-white flex items-center gap-2 mb-4">
              <Heart className="w-5 h-5 text-ember" />
              Mood Distribution
            </h3>
            <p className="text-sm text-slate-400 mb-4">This week&apos;s campus pulse</p>
            <div className="h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={weeklyMoodDistribution}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={3}
                    dataKey="count"
                  >
                    {weeklyMoodDistribution.map((entry, idx) => (
                      <Cell key={`cell-${idx}`} fill={pieColors[idx]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'rgba(10,10,15,0.9)',
                      border: '1px solid rgba(255,255,255,0.1)',
                      borderRadius: '12px',
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="space-y-1.5 mt-2">
              {weeklyMoodDistribution.map((item, i) => (
                <div key={item.mood} className="flex items-center justify-between text-xs">
                  <span className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: pieColors[i] }} />
                    <span className="text-slate-300">{item.mood}</span>
                  </span>
                  <span className="text-slate-500">{item.count}</span>
                </div>
              ))}
            </div>
          </GlassCard>
        </div>

        {/* Top Concerns */}
        <div className="mt-6">
          <GlassCard delay={0.5}>
            <h3 className="text-lg font-semibold text-white flex items-center gap-2 mb-4">
              <Brain className="w-5 h-5 text-nebula" />
              Trending Concerns
            </h3>
            <p className="text-sm text-slate-400 mb-4">
              Most discussed topics this week (anonymous aggregated data)
            </p>
            <div className="space-y-3">
              {topConcerns.map((concern, i) => (
                <motion.div
                  key={concern.topic}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6 + i * 0.05 }}
                  className="flex items-center justify-between p-3 rounded-xl glass hover:bg-white/5 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-lg font-bold text-slate-600 w-6">{i + 1}</span>
                    <span className={`text-sm font-medium ${concern.color}`}>
                      {concern.topic}
                    </span>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-xs text-slate-500">
                      {concern.mentions} mentions
                    </span>
                    <span
                      className={`text-xs font-medium ${
                        concern.trend.startsWith('+')
                          ? 'text-red-400'
                          : 'text-emerald-400'
                      }`}
                    >
                      {concern.trend}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          </GlassCard>
        </div>
      </div>
    </PageTransition>
  );
}
