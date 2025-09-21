import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BarChart3, Grid3X3, List, Zap } from "lucide-react";
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
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
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
      className="space-y-8"
    >
      {/* Hero Header */}
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10 rounded-3xl blur-3xl"></div>
        <div className="relative bg-white/40 dark:bg-slate-800/40 backdrop-blur-xl rounded-3xl border border-slate-200/50 dark:border-slate-700/50 p-10">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div>
              <motion.h1 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-slate-900 via-blue-800 to-purple-800 dark:from-white dark:via-blue-200 dark:to-purple-200 bg-clip-text text-transparent leading-tight"
              >
                Your Challenge Journey
              </motion.h1>
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-slate-600 dark:text-slate-300 mt-3 text-lg leading-relaxed"
              >
                Transform your goals into achievements with intelligent tracking and insights
              </motion.p>
            </div>

            <div className="flex items-center space-x-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowStats(!showStats)}
                className={`flex items-center space-x-2 px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
                  showStats 
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg' 
                    : 'bg-slate-100/80 hover:bg-slate-200/80 dark:bg-slate-700/80 dark:hover:bg-slate-600/80 text-slate-700 dark:text-slate-300'
                }`}
              >
                <BarChart3 className="w-4 h-4" />
                <span>{showStats ? "Hide Analytics" : "Show Analytics"}</span>
              </motion.button>

              <div className="flex items-center bg-slate-100/80 dark:bg-slate-700/80 rounded-xl p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-lg transition-all duration-200 ${
                    viewMode === 'grid' 
                      ? 'bg-white dark:bg-slate-600 shadow-sm' 
                      : 'hover:bg-slate-200/50 dark:hover:bg-slate-600/50'
                  }`}
                >
                  <Grid3X3 className="w-4 h-4 text-slate-600 dark:text-slate-400" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-lg transition-all duration-200 ${
                    viewMode === 'list' 
                      ? 'bg-white dark:bg-slate-600 shadow-sm' 
                      : 'hover:bg-slate-200/50 dark:hover:bg-slate-600/50'
                  }`}
                >
                  <List className="w-4 h-4 text-slate-600 dark:text-slate-400" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Statistics */}
      <AnimatePresence>
        {showStats && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
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

      {/* Challenge Results Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-lg">
            <Zap className="w-5 h-5 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
            Active Challenges
          </h2>
          <span className="px-3 py-1 bg-slate-100 dark:bg-slate-700 rounded-full text-sm font-semibold text-slate-600 dark:text-slate-400">
            {filteredChallenges.length}
          </span>
        </div>
      </div>

      {/* Challenge Grid/List */}
      <motion.div
        layout
        className={
          viewMode === 'grid' 
            ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8" 
            : "space-y-6"
        }
      >
        <AnimatePresence mode="popLayout">
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
          className="text-center py-20"
        >
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10 rounded-full blur-3xl"></div>
            <div className="relative text-8xl mb-6">🎯</div>
          </div>
          <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-3">
            No challenges found
          </h3>
          <p className="text-slate-500 dark:text-slate-400 mb-8 max-w-md mx-auto leading-relaxed">
            {challenges.length === 0
              ? "Ready to start your journey? Add your first challenge and begin tracking your progress!"
              : "Try adjusting your filters to discover more challenges that match your criteria."}
          </p>
        </motion.div>
      )}
    </motion.div>
  );
}