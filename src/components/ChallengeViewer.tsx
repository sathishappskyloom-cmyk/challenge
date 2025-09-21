import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, FileSpreadsheet, FileText, Calendar, Clock, TrendingUp, Award, Target } from "lucide-react";
import { Challenge } from "../types/Challenge";
import { getIconComponent } from "../utils/iconMapper";
import {
  formatDate,
  getDaysRemaining,
  getDaysElapsed,
} from "../utils/dateUtils";
import {
  loadExcelFromAssets,
  exportToExcel,
  exportToCSV,
} from "../utils/excelUtils";

interface ChallengeViewerProps {
  challenge: Challenge;
  onBack: () => void;
}

export function ChallengeViewer({ challenge, onBack }: ChallengeViewerProps) {
  const [excelData, setExcelData] = useState<any[][]>([]);

  const IconComponent = getIconComponent({ iconName: challenge.icon });
  const daysRemaining = getDaysRemaining(challenge.endDate);
  const daysElapsed = getDaysElapsed(challenge.startDate);
  const progressPercentage = Math.min(
    (daysElapsed / challenge.totalDays) * 100,
    100
  );

  useEffect(() => {
    loadExcelFromAssets(challenge.excelFile)
      .then((data) => setExcelData(data))
      .catch((error) => {
        console.error("Failed to load Excel file:", error);
        setExcelData([["No data available"]]);
      });
  }, [challenge]);

  const handleExportExcel = () => {
    exportToExcel(excelData, `${challenge.title}-data`);
  };

  const handleExportCSV = () => {
    exportToCSV(excelData, `${challenge.title}-data`);
  };

  const statusConfig = {
    active: {
      gradient: "from-emerald-500 to-teal-600",
      bg: "bg-emerald-50 dark:bg-emerald-900/20",
      text: "text-emerald-700 dark:text-emerald-300",
      border: "border-emerald-200 dark:border-emerald-800",
    },
    pending: {
      gradient: "from-amber-500 to-orange-600",
      bg: "bg-amber-50 dark:bg-amber-900/20",
      text: "text-amber-700 dark:text-amber-300",
      border: "border-amber-200 dark:border-amber-800",
    },
    completed: {
      gradient: "from-slate-500 to-slate-600",
      bg: "bg-slate-50 dark:bg-slate-800/50",
      text: "text-slate-700 dark:text-slate-300",
      border: "border-slate-200 dark:border-slate-700",
    },
  };

  const config = statusConfig[challenge.status];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onBack}
          className="flex items-center space-x-2 px-6 py-3 bg-slate-100/80 hover:bg-slate-200/80 dark:bg-slate-700/80 dark:hover:bg-slate-600/80 rounded-xl transition-all duration-300 text-slate-700 dark:text-slate-300 font-semibold backdrop-blur-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Challenges</span>
        </motion.button>

        <div className="flex items-center space-x-3">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleExportExcel}
            className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white rounded-xl transition-all duration-300 font-semibold shadow-lg"
          >
            <FileSpreadsheet className="w-4 h-4" />
            <span>Export Excel</span>
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleExportCSV}
            className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white rounded-xl transition-all duration-300 font-semibold shadow-lg"
          >
            <FileText className="w-4 h-4" />
            <span>Export CSV</span>
          </motion.button>
        </div>
      </div>

      {/* Challenge Info */}
      <div className="relative">
        <div className="absolute inset-0 bg-white/60 dark:bg-slate-800/60 backdrop-blur-xl rounded-3xl border border-slate-200/50 dark:border-slate-700/50"></div>
        <div className="relative p-10">
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-8 mb-8">
            <div className="flex items-start space-x-6">
              <div className="relative">
                <div className={`absolute inset-0 bg-gradient-to-r ${config.gradient} rounded-2xl blur opacity-30`}></div>
                <div className={`relative p-4 rounded-2xl bg-gradient-to-r ${config.gradient} text-white shadow-xl`}>
                  <IconComponent className="w-10 h-10" />
                </div>
              </div>
              <div>
                <h1 className="text-3xl lg:text-4xl font-bold text-slate-900 dark:text-slate-100 leading-tight">
                  {challenge.title}
                </h1>
                <p className="text-slate-600 dark:text-slate-300 mt-3 text-lg leading-relaxed max-w-2xl">
                  {challenge.description}
                </p>
                <div className="flex flex-wrap items-center gap-4 mt-4">
                  <span className="text-sm font-semibold text-slate-500 dark:text-slate-400">
                    Category: <span className="text-slate-700 dark:text-slate-300">{challenge.category}</span>
                  </span>
                  <div className={`flex items-center space-x-2 px-4 py-2 rounded-full ${config.bg} ${config.border} border`}>
                    <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${config.gradient} animate-pulse`} />
                    <span className={`text-sm font-bold ${config.text} uppercase tracking-wide`}>
                      {challenge.status}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Progress Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="text-center p-6 bg-blue-50 dark:bg-blue-900/20 rounded-2xl border border-blue-200/50 dark:border-blue-800/50">
              <Target className="w-8 h-8 text-blue-600 dark:text-blue-400 mx-auto mb-3" />
              <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                {challenge.totalDays}
              </p>
              <p className="text-sm font-semibold text-blue-700 dark:text-blue-300 uppercase tracking-wide">
                Total Days
              </p>
            </div>
            <div className="text-center p-6 bg-emerald-50 dark:bg-emerald-900/20 rounded-2xl border border-emerald-200/50 dark:border-emerald-800/50">
              <TrendingUp className="w-8 h-8 text-emerald-600 dark:text-emerald-400 mx-auto mb-3" />
              <p className="text-3xl font-bold text-emerald-600 dark:text-emerald-400">
                {Math.max(0, daysElapsed)}
              </p>
              <p className="text-sm font-semibold text-emerald-700 dark:text-emerald-300 uppercase tracking-wide">
                Days Elapsed
              </p>
            </div>
            <div className="text-center p-6 bg-orange-50 dark:bg-orange-900/20 rounded-2xl border border-orange-200/50 dark:border-orange-800/50">
              <Clock className="w-8 h-8 text-orange-600 dark:text-orange-400 mx-auto mb-3" />
              <p className="text-3xl font-bold text-orange-600 dark:text-orange-400">
                {Math.max(0, daysRemaining)}
              </p>
              <p className="text-sm font-semibold text-orange-700 dark:text-orange-300 uppercase tracking-wide">
                Days Remaining
              </p>
            </div>
            <div className="text-center p-6 bg-purple-50 dark:bg-purple-900/20 rounded-2xl border border-purple-200/50 dark:border-purple-800/50">
              <Award className="w-8 h-8 text-purple-600 dark:text-purple-400 mx-auto mb-3" />
              <p className="text-3xl font-bold text-purple-600 dark:text-purple-400">
                {progressPercentage.toFixed(0)}%
              </p>
              <p className="text-sm font-semibold text-purple-700 dark:text-purple-300 uppercase tracking-wide">
                Progress
              </p>
            </div>
          </div>

          {/* Progress Bar */}
          {challenge.status === "active" && (
            <div className="mb-8">
              <div className="flex justify-between items-center mb-4">
                <span className="text-lg font-bold text-slate-700 dark:text-slate-300">
                  Challenge Progress
                </span>
                <span className="text-sm font-semibold text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-700 px-3 py-1 rounded-full">
                  {progressPercentage.toFixed(1)}% Complete
                </span>
              </div>
              <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-4 overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${progressPercentage}%` }}
                  transition={{ duration: 1.5, ease: "easeOut" }}
                  className={`h-4 rounded-full bg-gradient-to-r ${config.gradient} shadow-sm`}
                />
              </div>
            </div>
          )}

          {/* Date Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-center space-x-3 p-4 bg-slate-50 dark:bg-slate-700/50 rounded-xl">
              <Calendar className="w-5 h-5 text-slate-500 dark:text-slate-400" />
              <div>
                <span className="text-sm font-semibold text-slate-500 dark:text-slate-400">Start Date</span>
                <p className="font-bold text-slate-700 dark:text-slate-300">{formatDate(challenge.startDate)}</p>
              </div>
            </div>
            <div className="flex items-center space-x-3 p-4 bg-slate-50 dark:bg-slate-700/50 rounded-xl">
              <Calendar className="w-5 h-5 text-slate-500 dark:text-slate-400" />
              <div>
                <span className="text-sm font-semibold text-slate-500 dark:text-slate-400">End Date</span>
                <p className="font-bold text-slate-700 dark:text-slate-300">{formatDate(challenge.endDate)}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Excel Data Table */}
      <div className="relative">
        <div className="absolute inset-0 bg-white/60 dark:bg-slate-800/60 backdrop-blur-xl rounded-3xl border border-slate-200/50 dark:border-slate-700/50"></div>
        <div className="relative p-10">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-8 flex items-center">
            <div className="w-2 h-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mr-4"></div>
            Challenge Data & Progress
          </h2>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                {excelData.length > 0 && (
                  <tr className="bg-slate-50/80 dark:bg-slate-700/80 backdrop-blur-sm">
                    {(excelData[0] || []).map((header: any, index: number) => (
                      <th
                        key={index}
                        className="px-6 py-4 text-left text-sm font-bold text-slate-700 dark:text-slate-300 border-b-2 border-slate-200 dark:border-slate-600 uppercase tracking-wide"
                      >
                        {header}
                      </th>
                    ))}
                  </tr>
                )}
              </thead>
              <tbody>
                {excelData.slice(1).map((row: any[], rowIndex: number) => (
                  <motion.tr
                    key={rowIndex}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: rowIndex * 0.03 }}
                    className="hover:bg-slate-50/80 dark:hover:bg-slate-700/50 transition-all duration-200 border-b border-slate-200/50 dark:border-slate-600/50"
                  >
                    {row.map((cell: any, colIndex: number) => (
                      <td
                        key={colIndex}
                        className="px-6 py-4 text-sm text-slate-900 dark:text-slate-100"
                      >
                        <span
                          className={
                            cell === "✅"
                              ? "text-emerald-500 text-lg"
                              : cell === "⏳"
                              ? "text-amber-500 text-lg"
                              : "font-medium"
                          }
                        >
                          {cell || "-"}
                        </span>
                      </td>
                    ))}
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </motion.div>
  );
}