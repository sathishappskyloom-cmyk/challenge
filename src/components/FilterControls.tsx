import React from "react";
import { motion } from "framer-motion";
import { Search, Filter, SortAsc, SortDesc } from "lucide-react";
import { FilterState } from "../types/Challenge";

interface FilterControlsProps {
  filters: FilterState;
  onFilterChange: (filters: FilterState) => void;
  categories: string[];
}

export function FilterControls({
  filters,
  onFilterChange,
  categories,
}: FilterControlsProps) {
  const statuses = ["all", "active", "pending", "completed"];
  const sortOptions = [
    { value: "startDate", label: "Start Date" },
    { value: "endDate", label: "End Date" },
    { value: "status", label: "Status" },
    { value: "title", label: "Title" },
  ];

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onFilterChange({ ...filters, search: e.target.value });
  };

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onFilterChange({ ...filters, status: e.target.value });
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onFilterChange({ ...filters, category: e.target.value });
  };

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onFilterChange({ ...filters, sortBy: e.target.value as any });
  };

  const toggleSortOrder = () => {
    onFilterChange({
      ...filters,
      sortOrder: filters.sortOrder === "asc" ? "desc" : "asc",
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6 mb-8"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Search */}
        <div className="lg:col-span-2">
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            <Search className="w-4 h-4 inline mr-1" />
            Search Challenges
          </label>
          <input
            type="text"
            value={filters.search}
            onChange={handleSearchChange}
            placeholder="Search by title..."
            className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100"
          />
        </div>

        {/* Status Filter */}
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            <Filter className="w-4 h-4 inline mr-1" />
            Status
          </label>
          <select
            value={filters.status}
            onChange={handleStatusChange}
            className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100"
          >
            {statuses.map((status) => (
              <option key={status} value={status}>
                {status === "all"
                  ? "All Statuses"
                  : status.charAt(0).toUpperCase() + status.slice(1)}
              </option>
            ))}
          </select>
        </div>

        {/* Category Filter */}
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            Category
          </label>
          <select
            value={filters.category}
            onChange={handleCategoryChange}
            className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100"
          >
            <option value="all">All Categories</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>

        {/* Sort */}
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            Sort By
          </label>
          <div className="flex space-x-2">
            <select
              value={filters.sortBy}
              onChange={handleSortChange}
              className="flex-1 px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100"
            >
              {sortOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <button
              onClick={toggleSortOrder}
              className="px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors duration-200 bg-white dark:bg-slate-700"
            >
              {filters.sortOrder === "asc" ? (
                <SortAsc className="w-4 h-4 text-slate-600 dark:text-slate-400" />
              ) : (
                <SortDesc className="w-4 h-4 text-slate-600 dark:text-slate-400" />
              )}
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
