import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BarChart3 } from "lucide-react";
import { ChallengeCard } from "../components/ChallengeCard";
import { FilterControls } from "../components/FilterControls";
import { StatisticsPanel } from "../components/StatisticsPanel";
import { Challenge, FilterState, Statistics } from "../types/Challenge";

interface HomePageProps {
  challenges: Challenge[];
  onViewChallenge: (challenge: Challenge) => void;
}

export function HomePage({ challenges, onViewChallenge }: HomePageProps) {
  const [showStats, setShowStats] = useState(true);
  const [filters, setFilters] = useState<FilterState>({
    status: "all",
    category: "all",
    search: "",
    sortBy: "startDate",
    sortOrder: "desc",
  });

  const categories = useMemo(() => {
    const uniqueCategories = [...new Set(challenges.map((c) => c.category))];
    return uniqueCategories.sort();
  }, [challenges]);

  const filteredChallenges = useMemo(() => {
    let filtered = challenges;

    // Apply filters
    if (filters.status !== "all") {
      filtered = filtered.filter((c) => c.status === filters.status);
    }

    if (filters.category !== "all") {
      filtered = filtered.filter((c) => c.category === filters.category);
    }

    if (filters.search) {
      filtered = filtered.filter((c) =>
        c.title.toLowerCase().includes(filters.search.toLowerCase())
      );
    }

    // Apply sorting
    filtered.sort((a, b) => {
      let aVal: any;
      let bVal: any;

      switch (filters.sortBy) {
        case "startDate":
        case "endDate":
          aVal = new Date(a[filters.sortBy]).getTime();
          bVal = new Date(b[filters.sortBy]).getTime();
          break;
        case "title":
          aVal = a[filters.sortBy].toLowerCase();
          bVal = b[filters.sortBy].toLowerCase();
          break;
        case "status":
          const statusOrder = { active: 1, pending: 2, completed: 3 };
          aVal = statusOrder[a.status];
          bVal = statusOrder[b.status];
          break;
        default:
          aVal = a[filters.sortBy as keyof Challenge];
          bVal = b[filters.sortBy as keyof Challenge];
      }

      if (filters.sortOrder === "asc") {
        return aVal < bVal ? -1 : aVal > bVal ? 1 : 0;
      } else {
        return aVal > bVal ? -1 : aVal < bVal ? 1 : 0;
      }
    });

    return filtered;
  }, [challenges, filters]);

  const statistics = useMemo<Statistics>(() => {
    const total = challenges.length;
    const active = challenges.filter((c) => c.status === "active").length;
    const completed = challenges.filter((c) => c.status === "completed").length;
    const pending = challenges.filter((c) => c.status === "pending").length;

    const categoryCounts = challenges.reduce((acc, challenge) => {
      acc[challenge.category] = (acc[challenge.category] || 0) + 1;
      return acc;
    }, {} as { [key: string]: number });

    return {
      totalChallenges: total,
      activeChallenges: active,
      completedChallenges: completed,
      pendingChallenges: pending,
      completionRate: total > 0 ? (completed / total) * 100 : 0,
      categoryCounts,
    };
  }, [challenges]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      {/* Header Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-stone-900 dark:text-stone-100">
            My Challenges
          </h1>
          <p className="text-stone-600 dark:text-stone-400 mt-1">
            Track your progress and achieve your goals
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={() => setShowStats(!showStats)}
            className="flex items-center space-x-2 px-4 py-2 bg-stone-100 hover:bg-stone-200 dark:bg-stone-700 dark:hover:bg-stone-600 rounded-lg transition-colors duration-200 text-stone-700 dark:text-stone-300"
          >
            <BarChart3 className="w-4 h-4" />
            <span>{showStats ? "Hide Stats" : "Show Stats"}</span>
          </button>
        </div>
      </div>

      {/* Statistics */}
      <AnimatePresence>
        {showStats && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <StatisticsPanel statistics={statistics} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Filters */}
      <FilterControls
        filters={filters}
        onFilterChange={setFilters}
        categories={categories}
      />

      {/* Challenge Results */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-stone-900 dark:text-stone-100">
          Challenges ({filteredChallenges.length})
        </h2>
      </div>

      {/* Challenge Grid */}
      <motion.div
        layout
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        <AnimatePresence>
          {filteredChallenges.map((challenge) => (
            <ChallengeCard
              key={challenge.id}
              challenge={challenge}
              onView={onViewChallenge}
            />
          ))}
        </AnimatePresence>
      </motion.div>

      {/* Empty State */}
      {filteredChallenges.length === 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-12"
        >
          <div className="text-6xl mb-4">🎯</div>
          <h3 className="text-xl font-semibold text-stone-900 dark:text-stone-100 mb-2">
            No challenges found
          </h3>
          <p className="text-stone-500 dark:text-stone-400 mb-6">
            {challenges.length === 0
              ? "Get started by adding excel file for your first challenge!"
              : "Try adjusting your filters to see more challenges."}
          </p>
        </motion.div>
      )}
    </motion.div>
  );
}
