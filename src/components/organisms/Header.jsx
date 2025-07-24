import React, { useState } from "react";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import SearchBar from "@/components/molecules/SearchBar";
import Select from "@/components/atoms/Select";

const Header = ({ 
  searchQuery, 
  onSearchChange, 
  filters, 
  onFiltersChange,
  onAddTask,
  activeProject,
  className 
}) => {
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  const handlePriorityFilter = (priority) => {
    const currentPriorities = filters.priority || [];
    const newPriorities = currentPriorities.includes(priority)
      ? currentPriorities.filter(p => p !== priority)
      : [...currentPriorities, priority];
    
    onFiltersChange({ ...filters, priority: newPriorities });
  };

  return (
    <div className={`bg-white/90 backdrop-blur-md border-b border-gray-200 ${className}`}>
      <div className="px-6 py-4">
        {/* Desktop Header */}
        <div className="hidden md:flex items-center justify-between">
          <div className="flex items-center space-x-6">
            <SearchBar
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search tasks..."
              className="w-80"
            />
            
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium text-gray-700">Priority:</span>
              {["high", "medium", "low"].map((priority) => (
                <button
                  key={priority}
                  onClick={() => handlePriorityFilter(priority)}
                  className={`px-3 py-1 text-xs font-medium rounded-full transition-all duration-200 ${
                    filters.priority?.includes(priority)
                      ? "bg-primary-500 text-white shadow-lg"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  {priority}
                </button>
              ))}
              {filters.priority?.length > 0 && (
                <button
                  onClick={() => onFiltersChange({ ...filters, priority: [] })}
                  className="text-xs text-gray-500 hover:text-gray-700 ml-2"
                >
                  Clear
                </button>
              )}
            </div>
          </div>

          <div className="flex items-center space-x-3">
            {activeProject && (
              <Button onClick={onAddTask}>
                <ApperIcon name="Plus" className="h-4 w-4 mr-2" />
                Add Task
              </Button>
            )}
          </div>
        </div>

        {/* Mobile Header */}
        <div className="md:hidden space-y-4">
          <div className="flex items-center justify-between">
            <h1 className="text-lg font-display font-bold text-gray-900">
              TaskFlow
            </h1>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setShowMobileFilters(!showMobileFilters)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ApperIcon name="Filter" className="h-5 w-5 text-gray-600" />
              </button>
              {activeProject && (
                <Button onClick={onAddTask} size="small">
                  <ApperIcon name="Plus" className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>

          <SearchBar
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search tasks..."
          />

          {showMobileFilters && (
            <div className="p-4 bg-gray-50 rounded-lg">
              <h3 className="text-sm font-medium text-gray-700 mb-3">Filters</h3>
              <div className="space-y-3">
                <div>
                  <span className="text-sm text-gray-600 mb-2 block">Priority:</span>
                  <div className="flex flex-wrap gap-2">
                    {["high", "medium", "low"].map((priority) => (
                      <button
                        key={priority}
                        onClick={() => handlePriorityFilter(priority)}
                        className={`px-3 py-1 text-xs font-medium rounded-full transition-all duration-200 ${
                          filters.priority?.includes(priority)
                            ? "bg-primary-500 text-white shadow-lg"
                            : "bg-white text-gray-600 hover:bg-gray-100 border border-gray-200"
                        }`}
                      >
                        {priority}
                      </button>
                    ))}
                  </div>
                </div>
                
                {filters.priority?.length > 0 && (
                  <button
                    onClick={() => onFiltersChange({ ...filters, priority: [] })}
                    className="text-sm text-primary-600 hover:text-primary-700 font-medium"
                  >
                    Clear all filters
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Header;