import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Plus } from "lucide-react";
import { ChallengeTemplate, Challenge } from "../types/Challenge";
import { getIconComponent } from "../utils/iconMapper";
import { calculateTotalDays } from "../utils/dateUtils";

interface TemplateModalProps {
  isOpen: boolean;
  onClose: () => void;
  templates: ChallengeTemplate[];
  onCreateChallenge: (challenge: Challenge) => void;
}

export function TemplateModal({
  isOpen,
  onClose,
  templates,
  onCreateChallenge,
}: TemplateModalProps) {
  const [selectedTemplate, setSelectedTemplate] =
    useState<ChallengeTemplate | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    startDate: "",
    duration: 30,
  });

  const handleTemplateSelect = (template: ChallengeTemplate) => {
    setSelectedTemplate(template);
    setFormData({
      title: template.title,
      description: template.description,
      startDate: new Date().toISOString().split("T")[0],
      duration: template.defaultDuration,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTemplate) return;

    const startDate = new Date(formData.startDate);
    const endDate = new Date(startDate);
    endDate.setDate(startDate.getDate() + formData.duration - 1);

    const newChallenge: Challenge = {
      id: `challenge-${Date.now()}`,
      title: formData.title,
      description: formData.description,
      icon: selectedTemplate.icon,
      category: selectedTemplate.category,
      excelFile: `${formData.title.toLowerCase().replace(/\s+/g, "-")}.xlsx`,
      status: "pending",
      startDate: formData.startDate,
      endDate: endDate.toISOString().split("T")[0],
      totalDays: formData.duration,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    onCreateChallenge(newChallenge);
    onClose();
    setSelectedTemplate(null);
    setFormData({ title: "", description: "", startDate: "", duration: 30 });
  };

  const handleInputChange = (field: string, value: string | number) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-white dark:bg-slate-800 rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-6 border-b border-slate-200 dark:border-slate-700">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                Create Challenge from Template
              </h2>
              <button
                onClick={onClose}
                className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors duration-200"
              >
                <X className="w-5 h-5 text-slate-500" />
              </button>
            </div>

            <div className="flex flex-col lg:flex-row max-h-[calc(90vh-80px)]">
              {/* Template Selection */}
              <div className="lg:w-1/2 p-6 border-r border-slate-200 dark:border-slate-700 overflow-y-auto">
                <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4">
                  Choose Template
                </h3>
                <div className="space-y-3">
                  {templates.map((template) => {
                    const IconComponent = getIconComponent({
                      iconName: template.icon,
                    });
                    const isSelected = selectedTemplate?.id === template.id;

                    return (
                      <motion.button
                        key={template.id}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => handleTemplateSelect(template)}
                        className={`w-full p-4 rounded-lg border-2 transition-all duration-200 text-left ${
                          isSelected
                            ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                            : "border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600"
                        }`}
                      >
                        <div className="flex items-start space-x-3">
                          <div className="p-2 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                            <IconComponent className="w-5 h-5" />
                          </div>
                          <div className="flex-1">
                            <h4 className="font-medium text-slate-900 dark:text-slate-100">
                              {template.title}
                            </h4>
                            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                              {template.description}
                            </p>
                            <div className="flex items-center space-x-4 mt-2 text-xs text-slate-500 dark:text-slate-400">
                              <span>{template.category}</span>
                              <span>{template.defaultDuration} days</span>
                            </div>
                          </div>
                        </div>
                      </motion.button>
                    );
                  })}
                </div>
              </div>

              {/* Challenge Configuration */}
              <div className="lg:w-1/2 p-6 overflow-y-auto">
                <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4">
                  Customize Challenge
                </h3>

                {selectedTemplate ? (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                        Challenge Title
                      </label>
                      <input
                        type="text"
                        value={formData.title}
                        onChange={(e) =>
                          handleInputChange("title", e.target.value)
                        }
                        className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                        Description
                      </label>
                      <textarea
                        value={formData.description}
                        onChange={(e) =>
                          handleInputChange("description", e.target.value)
                        }
                        rows={3}
                        className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                        Start Date
                      </label>
                      <input
                        type="date"
                        value={formData.startDate}
                        onChange={(e) =>
                          handleInputChange("startDate", e.target.value)
                        }
                        className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                        Duration (days)
                      </label>
                      <input
                        type="number"
                        min="1"
                        max="365"
                        value={formData.duration}
                        onChange={(e) =>
                          handleInputChange(
                            "duration",
                            parseInt(e.target.value)
                          )
                        }
                        className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100"
                        required
                      />
                    </div>

                    <div className="bg-slate-50 dark:bg-slate-700 rounded-lg p-4">
                      <h4 className="font-medium text-slate-900 dark:text-slate-100 mb-2">
                        Challenge Preview
                      </h4>
                      <div className="space-y-1 text-sm text-slate-600 dark:text-slate-400">
                        <p>
                          <span className="font-medium">Category:</span>{" "}
                          {selectedTemplate.category}
                        </p>
                        <p>
                          <span className="font-medium">Duration:</span>{" "}
                          {formData.duration} days
                        </p>
                        {formData.startDate && (
                          <p>
                            <span className="font-medium">End Date:</span>{" "}
                            {new Date(
                              new Date(formData.startDate).getTime() +
                                (formData.duration - 1) * 24 * 60 * 60 * 1000
                            ).toLocaleDateString()}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex space-x-3 pt-4">
                      <button
                        type="button"
                        onClick={onClose}
                        className="flex-1 px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors duration-200 text-slate-700 dark:text-slate-300"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="flex-1 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-lg transition-all duration-200 flex items-center justify-center space-x-2"
                      >
                        <Plus className="w-4 h-4" />
                        <span>Create Challenge</span>
                      </button>
                    </div>
                  </form>
                ) : (
                  <div className="text-center py-12">
                    <p className="text-slate-500 dark:text-slate-400">
                      Select a template to get started
                    </p>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
