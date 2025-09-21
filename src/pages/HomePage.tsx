import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Upload, BarChart3 } from 'lucide-react';
import { ChallengeCard } from '../components/ChallengeCard';
import { FilterControls } from '../components/FilterControls';
import { StatisticsPanel } from '../components/StatisticsPanel';
import { TemplateModal } from '../components/TemplateModal';
import { Challenge, FilterState, Statistics } from '../types/Challenge';
import { challengeTemplates } from '../data/challengeTemplates';

interface HomePageProps {
  challenges: Challenge[];
  onViewChallenge: (challenge: Challenge) => void;
  onAddChallenge: (challenge: Challenge) => void;
}

export function HomePage({ challenges, onViewChallenge, onAddChallenge }: HomePageProps) {
  const [showTemplateModal, setShowTemplateModal] = useState(false);
  const [showStats, setShowStats] = useState(true);
  const [filters, setFilters] = useState<FilterState>({
    status: 'all',
    category: 'all',
    search: '',
    sortBy: 'startDate',
    sortOrder: 'desc'
  });

  const categories = useMemo(() => {
    const uniqueCategories = [...new Set(challenges.map(c => c.category))];
    return uniqueCategories.sort();
  }, [challenges]);

  const filteredChallenges = useMemo(() => {
    let filtered = challenges;

    // Apply filters
    if (filters.status !== 'all') {
      filtered = filtered.filter(c => c.status === filters.status);
    }

    if (filters.category !== 'all') {
      filtered = filtered.filter(c => c.category === filters.category);
    }

    if (filters.search) {
      filtered = filtered.filter(c => 
        c.title.toLowerCase().includes(filters.search.toLowerCase())
      );
    }

    // Apply sorting
    filtered.sort((a, b) => {
      let aVal: any;
      let bVal: any;

      switch (filters.sortBy) {
        case 'startDate':
        case 'endDate':
          aVal = new Date(a[filters.sortBy]).getTime();
          bVal = new Date(b[filters.sortBy]).getTime();
          break;
        case 'title':
          aVal = a[filters.sortBy].toLowerCase();
          bVal = b[filters.sortBy].toLowerCase();
          break;
        case 'status':
          const statusOrder = { active: 1, pending: 2, completed: 3 };
          aVal = statusOrder[a.status];
          bVal = statusOrder[b.status];
          break;
        default:
          aVal = a[filters.sortBy as keyof Challenge];
          bVal = b[filters.sortBy as keyof Challenge];
      }

      if (filters.sortOrder === 'asc') {
        return aVal < bVal ? -1 : aVal > bVal ? 1 : 0;
      } else {
        return aVal > bVal ? -1 : aVal < bVal ? 1 : 0;
      }
    });

    return filtered;
  }, [challenges, filters]);

  const statistics = useMemo<Statistics>(() => {
    const total = challenges.length;
    const active = challenges.filter(c => c.status === 'active').length;
    const completed = challenges.filter(c => c.status === 'completed').length;
    const pending = challenges.filter(c => c.status === 'pending').length;
    
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
      categoryCounts
    };
  }, [challenges]);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // This would typically parse the Excel file and create a challenge
    // For demo purposes, we'll create a sample challenge
    const newChallenge: Challenge = {
      id: `challenge-${Date.now()}`,
      title: `Imported: ${file.name.replace('.xlsx', '').replace('.csv', '')}`,
      description: `Challenge imported from ${file.name}`,
      icon: 'FileSpreadsheet',
      category: 'Imported',
      excelFile: file.name,
      status: 'pending',
      startDate: new Date().toISOString().split('T')[0],
      endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      totalDays: 30,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    onAddChallenge(newChallenge);
    event.target.value = '';
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      {/* Header Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">
            My Challenges
          </h1>
          <p className="text-slate-600 dark:text-slate-400 mt-1">
            Track your progress and achieve your goals
          </p>
        </div>
        
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setShowStats(!showStats)}
            className="flex items-center space-x-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 rounded-lg transition-colors duration-200 text-slate-700 dark:text-slate-300"
          >
            <BarChart3 className="w-4 h-4" />
            <span>{showStats ? 'Hide Stats' : 'Show Stats'}</span>
          </button>
          
          <label className="flex items-center space-x-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg cursor-pointer transition-colors duration-200">
            <Upload className="w-4 h-4" />
            <span>Import File</span>
            <input
              type="file"
              accept=".xlsx,.xls,.csv"
              onChange={handleFileUpload}
              className="hidden"
            />
          </label>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowTemplateModal(true)}
            className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-lg transition-all duration-200"
          >
            <Plus className="w-4 h-4" />
            <span>New Challenge</span>
          </motion.button>
        </div>
      </div>

      {/* Statistics */}
      <AnimatePresence>
        {showStats && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
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
        <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">
          Challenges ({filteredChallenges.length})
        </h2>
      </div>

      {/* Challenge Grid */}
      <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
          <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-2">
            No challenges found
          </h3>
          <p className="text-slate-500 dark:text-slate-400 mb-6">
            {challenges.length === 0
              ? "Get started by creating your first challenge!"
              : "Try adjusting your filters to see more challenges."}
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowTemplateModal(true)}
            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-lg transition-all duration-200"
          >
            Create Your First Challenge
          </motion.button>
        </motion.div>
      )}

      {/* Template Modal */}
      <TemplateModal
        isOpen={showTemplateModal}
        onClose={() => setShowTemplateModal(false)}
        templates={challengeTemplates}
        onCreateChallenge={onAddChallenge}
      />
    </motion.div>
  );
}