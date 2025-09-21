import React from 'react';
import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, Target, CheckCircle, Clock, Activity } from 'lucide-react';
import { Statistics } from '../types/Challenge';

interface StatisticsPanelProps {
  statistics: Statistics;
}

const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899'];

export function StatisticsPanel({ statistics }: StatisticsPanelProps) {
  const categoryData = Object.entries(statistics.categoryCounts).map(([name, value]) => ({
    name,
    value
  }));

  const stats = [
    {
      label: 'Total Challenges',
      value: statistics.totalChallenges,
      icon: Target,
      color: 'from-blue-500 to-blue-600',
      textColor: 'text-blue-600 dark:text-blue-400'
    },
    {
      label: 'Active Challenges',
      value: statistics.activeChallenges,
      icon: Activity,
      color: 'from-green-500 to-green-600',
      textColor: 'text-green-600 dark:text-green-400'
    },
    {
      label: 'Completed',
      value: statistics.completedChallenges,
      icon: CheckCircle,
      color: 'from-purple-500 to-purple-600',
      textColor: 'text-purple-600 dark:text-purple-400'
    },
    {
      label: 'Completion Rate',
      value: `${statistics.completionRate.toFixed(1)}%`,
      icon: TrendingUp,
      color: 'from-orange-500 to-orange-600',
      textColor: 'text-orange-600 dark:text-orange-400'
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6 mb-8"
    >
      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
                  {stat.label}
                </p>
                <p className={`text-2xl font-bold ${stat.textColor} mt-1`}>
                  {stat.value}
                </p>
              </div>
              <div className={`p-3 rounded-lg bg-gradient-to-br ${stat.color}`}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Charts */}
      {categoryData.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Bar Chart */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6"
          >
            <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4">
              Challenges by Category
            </h3>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={categoryData}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                <XAxis 
                  dataKey="name" 
                  tick={{ fontSize: 12 }}
                  className="fill-slate-600 dark:fill-slate-400"
                />
                <YAxis 
                  tick={{ fontSize: 12 }}
                  className="fill-slate-600 dark:fill-slate-400"
                />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'rgba(15, 23, 42, 0.9)',
                    border: 'none',
                    borderRadius: '8px',
                    color: 'white'
                  }}
                />
                <Bar 
                  dataKey="value" 
                  fill="url(#colorGradient)" 
                  radius={[4, 4, 0, 0]}
                />
                <defs>
                  <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.9}/>
                    <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0.9}/>
                  </linearGradient>
                </defs>
              </BarChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Pie Chart */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6"
          >
            <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4">
              Category Distribution
            </h3>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </motion.div>
        </div>
      )}
    </motion.div>
  );
}