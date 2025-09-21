import { motion } from "framer-motion";
import { Eye, Calendar, Clock } from "lucide-react";
import { Challenge } from "../types/Challenge";
import { getIconComponent } from "../utils/iconMapper";
import { formatDate, getDaysRemaining } from "../utils/dateUtils";

interface ChallengeCardProps {
  challenge: Challenge;
  onView: (challenge: Challenge) => void;
}

export function ChallengeCard({ challenge, onView }: ChallengeCardProps) {
  const IconComponent = getIconComponent({ iconName: challenge.icon });
  const daysRemaining = getDaysRemaining(challenge.endDate);

  const statusColors = {
    active: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
    pending:
      "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
    completed:
      "bg-stone-100 text-stone-800 dark:bg-stone-700 dark:text-stone-300",
  };

  const statusDots = {
    active: "bg-green-500",
    pending: "bg-yellow-500",
    completed: "bg-stone-500",
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      whileHover={{ y: -4, scale: 1.02 }}
      className="bg-white dark:bg-stone-800 rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 border border-stone-200 dark:border-stone-700 overflow-hidden"
    >
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 text-white">
              <IconComponent className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-semibold text-stone-900 dark:text-stone-100 text-lg">
                {challenge.title}
              </h3>
              <p className="text-sm text-stone-500 dark:text-stone-400 mt-1">
                {challenge.category}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <div
              className={`w-2 h-2 rounded-full ${statusDots[challenge.status]}`}
            />
            <span
              className={`px-2 py-1 rounded-full text-xs font-medium ${
                statusColors[challenge.status]
              }`}
            >
              {challenge.status.charAt(0).toUpperCase() +
                challenge.status.slice(1)}
            </span>
          </div>
        </div>

        <p className="text-stone-600 dark:text-stone-300 text-sm mb-4 line-clamp-2">
          {challenge.description}
        </p>

        <div className="space-y-2 mb-6">
          <div className="flex items-center text-xs text-stone-500 dark:text-stone-400">
            <Calendar className="w-4 h-4 mr-2" />
            <span>
              {formatDate(challenge.startDate)} -{" "}
              {formatDate(challenge.endDate)}
            </span>
          </div>
          <div className="flex items-center text-xs text-stone-500 dark:text-stone-400">
            <Clock className="w-4 h-4 mr-2" />
            <span>{challenge.totalDays} days total</span>
            {challenge.status === "active" && daysRemaining > 0 && (
              <span className="ml-2 text-orange-600 dark:text-orange-400">
                ({daysRemaining} days left)
              </span>
            )}
          </div>
        </div>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => onView(challenge)}
          className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-2.5 px-4 rounded-lg font-medium transition-all duration-200 flex items-center justify-center space-x-2"
        >
          <Eye className="w-4 h-4" />
          <span>View Challenge</span>
        </motion.button>
      </div>
    </motion.div>
  );
}
