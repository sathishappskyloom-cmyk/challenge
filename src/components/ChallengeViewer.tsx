import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Download,
  FileSpreadsheet,
  FileText,
  Edit3,
  Save,
  X,
} from "lucide-react";
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
  const [isEditing, setIsEditing] = useState(false);
  const [editedData, setEditedData] = useState<any[][]>([]);

  const IconComponent = getIconComponent({ iconName: challenge.icon });
  const daysRemaining = getDaysRemaining(challenge.endDate);
  const daysElapsed = getDaysElapsed(challenge.startDate);
  const progressPercentage = Math.min(
    (daysElapsed / challenge.totalDays) * 100,
    100
  );

  useEffect(() => {
    // Load actual Excel file from assets
    loadExcelFromAssets(challenge.excelFile)
      .then((data) => {
        setExcelData(data);
        setEditedData(data);
      })
      .catch((error) => {
        console.error("Failed to load Excel file:", error);
        // Fallback to empty data
        const fallbackData = [["No data available"]];
        setExcelData(fallbackData);
        setEditedData(fallbackData);
      });
  }, [challenge]);

  const handleCellEdit = (
    rowIndex: number,
    colIndex: number,
    value: string
  ) => {
    const newData = [...editedData];
    newData[rowIndex][colIndex] = value;
    setEditedData(newData);
  };

  const handleSaveEdit = () => {
    setExcelData(editedData);
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setEditedData(excelData);
    setIsEditing(false);
  };

  const handleExportExcel = () => {
    exportToExcel(excelData, `${challenge.title}-data`);
  };

  const handleExportCSV = () => {
    exportToCSV(excelData, `${challenge.title}-data`);
  };

  const statusColors = {
    active: "bg-green-500",
    pending: "bg-yellow-500",
    completed: "bg-slate-500",
  };

  const statusTextColors = {
    active: "text-green-600 dark:text-green-400",
    pending: "text-yellow-600 dark:text-yellow-400",
    completed: "text-slate-600 dark:text-slate-400",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onBack}
          className="flex items-center space-x-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 rounded-lg transition-colors duration-200 text-slate-700 dark:text-slate-300"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Challenges</span>
        </motion.button>

        <div className="flex items-center space-x-2">
          {!isEditing ? (
            <>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsEditing(true)}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200"
              >
                <Edit3 className="w-4 h-4" />
                <span>Edit Data</span>
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleExportExcel}
                className="flex items-center space-x-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors duration-200"
              >
                <FileSpreadsheet className="w-4 h-4" />
                <span>Export Excel</span>
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleExportCSV}
                className="flex items-center space-x-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors duration-200"
              >
                <FileText className="w-4 h-4" />
                <span>Export CSV</span>
              </motion.button>
            </>
          ) : (
            <>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleSaveEdit}
                className="flex items-center space-x-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors duration-200"
              >
                <Save className="w-4 h-4" />
                <span>Save Changes</span>
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleCancelEdit}
                className="flex items-center space-x-2 px-4 py-2 bg-slate-600 hover:bg-slate-700 text-white rounded-lg transition-colors duration-200"
              >
                <X className="w-4 h-4" />
                <span>Cancel</span>
              </motion.button>
            </>
          )}
        </div>
      </div>

      {/* Challenge Info */}
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6">
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center space-x-4">
            <div className="p-3 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 text-white">
              <IconComponent className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                {challenge.title}
              </h1>
              <p className="text-slate-600 dark:text-slate-400 mt-1">
                {challenge.description}
              </p>
              <div className="flex items-center space-x-4 mt-2">
                <span className="text-sm text-slate-500 dark:text-slate-400">
                  Category:{" "}
                  <span className="font-medium">{challenge.category}</span>
                </span>
                <div className="flex items-center space-x-2">
                  <div
                    className={`w-2 h-2 rounded-full ${
                      statusColors[challenge.status]
                    }`}
                  />
                  <span
                    className={`text-sm font-medium ${
                      statusTextColors[challenge.status]
                    }`}
                  >
                    {challenge.status.charAt(0).toUpperCase() +
                      challenge.status.slice(1)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Progress Info */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="text-center">
            <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              {challenge.totalDays}
            </p>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Total Days
            </p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-green-600 dark:text-green-400">
              {Math.max(0, daysElapsed)}
            </p>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Days Elapsed
            </p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-orange-600 dark:text-orange-400">
              {Math.max(0, daysRemaining)}
            </p>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Days Remaining
            </p>
          </div>
        </div>

        {/* Progress Bar */}
        {challenge.status === "active" && (
          <div className="mb-6">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                Progress
              </span>
              <span className="text-sm text-slate-500 dark:text-slate-400">
                {progressPercentage.toFixed(1)}%
              </span>
            </div>
            <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progressPercentage}%` }}
                transition={{ duration: 1, ease: "easeOut" }}
                className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full"
              />
            </div>
          </div>
        )}

        {/* Date Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-slate-600 dark:text-slate-400">
          <div>
            <span className="font-medium">Start Date:</span>{" "}
            {formatDate(challenge.startDate)}
          </div>
          <div>
            <span className="font-medium">End Date:</span>{" "}
            {formatDate(challenge.endDate)}
          </div>
        </div>
      </div>

      {/* Excel Data Table */}
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6">
        <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-4">
          Challenge Data
          {isEditing && (
            <span className="ml-2 text-sm text-blue-600 dark:text-blue-400 font-normal">
              (Editing Mode)
            </span>
          )}
        </h2>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              {excelData.length > 0 && (
                <tr className="bg-slate-50 dark:bg-slate-700">
                  {(excelData[0] || []).map((header: any, index: number) => (
                    <th
                      key={index}
                      className="px-4 py-3 text-left text-sm font-medium text-slate-700 dark:text-slate-300 border-b border-slate-200 dark:border-slate-600"
                    >
                      {header}
                    </th>
                  ))}
                </tr>
              )}
            </thead>
            <tbody>
              {(isEditing ? editedData : excelData)
                .slice(1)
                .map((row: any[], rowIndex: number) => (
                  <motion.tr
                    key={rowIndex}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: rowIndex * 0.05 }}
                    className="hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors duration-150"
                  >
                    {row.map((cell: any, colIndex: number) => (
                      <td
                        key={colIndex}
                        className="px-4 py-3 text-sm text-slate-900 dark:text-slate-100 border-b border-slate-200 dark:border-slate-600"
                      >
                        {isEditing ? (
                          <input
                            type="text"
                            value={cell || ""}
                            onChange={(e) =>
                              handleCellEdit(
                                rowIndex + 1,
                                colIndex,
                                e.target.value
                              )
                            }
                            className="w-full px-2 py-1 border border-slate-300 dark:border-slate-600 rounded bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          />
                        ) : (
                          <span
                            className={
                              cell === "✅"
                                ? "text-green-500 text-lg"
                                : cell === "⏳"
                                ? "text-yellow-500 text-lg"
                                : ""
                            }
                          >
                            {cell || "-"}
                          </span>
                        )}
                      </td>
                    ))}
                  </motion.tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
    </motion.div>
  );
}
