import React from "react";
import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import ProjectCard from "@/components/molecules/ProjectCard";

const MobileSidebar = ({ 
  isOpen, 
  onClose, 
  projects = [],
  activeProject,
  onProjectSelect,
  onAddProject,
  taskCounts = {}
}) => {
  const handleProjectSelect = (project) => {
    onProjectSelect(project);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
        onClick={onClose}
      />
      
      {/* Sidebar */}
      <motion.div
        initial={{ x: "-100%" }}
        animate={{ x: 0 }}
        exit={{ x: "-100%" }}
        transition={{ type: "spring", damping: 30, stiffness: 300 }}
        className="fixed left-0 top-0 bottom-0 w-80 bg-gradient-to-b from-gray-50 to-white border-r border-gray-200 z-50 lg:hidden overflow-y-auto"
      >
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-display font-bold gradient-text">
              Projects
            </h2>
            <div className="flex items-center space-x-2">
              <Button 
                onClick={onAddProject}
                size="small"
                className="rounded-full p-2"
              >
                <ApperIcon name="Plus" className="h-4 w-4" />
              </Button>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ApperIcon name="X" className="h-5 w-5 text-gray-500" />
              </button>
            </div>
          </div>

          <div className="space-y-3">
            {projects.length === 0 ? (
              <div className="text-center py-12">
                <ApperIcon name="FolderPlus" className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-display font-semibold text-gray-700 mb-2">
                  No Projects Yet
                </h3>
                <p className="text-gray-500 text-sm mb-4">
                  Create your first project to get started with task management.
                </p>
                <Button onClick={onAddProject} size="small">
                  <ApperIcon name="Plus" className="h-4 w-4 mr-2" />
                  Create Project
                </Button>
              </div>
            ) : (
              projects.map((project) => (
                <ProjectCard
                  key={project.Id}
                  project={project}
                  isActive={activeProject?.Id === project.Id}
                  taskCount={taskCounts[project.Id] || 0}
                  onClick={() => handleProjectSelect(project)}
                />
              ))
            )}
          </div>
        </div>
      </motion.div>
    </>
  );
};

export default MobileSidebar;