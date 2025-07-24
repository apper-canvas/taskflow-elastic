import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import ProjectCard from "@/components/molecules/ProjectCard";
import { projectService } from "@/services/api/projectService";
import { taskService } from "@/services/api/taskService";

const ProjectSidebar = ({ 
  activeProject, 
  onProjectSelect, 
  onAddProject,
  className 
}) => {
  const [projects, setProjects] = useState([]);
  const [taskCounts, setTaskCounts] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadProjects = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const projectsData = await projectService.getAll();
      setProjects(projectsData);
      
      // Load task counts for each project
      const counts = {};
      for (const project of projectsData) {
        const tasks = await taskService.getByProject(project.Id);
        counts[project.Id] = tasks.length;
      }
      setTaskCounts(counts);
    } catch (err) {
      setError("Failed to load projects");
      console.error("Error loading projects:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProjects();
  }, []);

  if (loading) {
    return (
      <div className={`w-80 bg-white border-r border-gray-200 p-6 ${className}`}>
        <div className="space-y-4">
          <div className="h-8 bg-gray-200 rounded animate-pulse"></div>
          <div className="h-10 bg-gray-200 rounded animate-pulse"></div>
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-24 bg-gray-200 rounded animate-pulse"></div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`w-80 bg-white border-r border-gray-200 p-6 ${className}`}>
        <div className="text-center py-8">
          <ApperIcon name="AlertCircle" className="h-12 w-12 text-error mx-auto mb-4" />
          <p className="text-error font-medium mb-4">{error}</p>
          <Button onClick={loadProjects} variant="outline" size="small">
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className={`w-80 bg-gradient-to-b from-gray-50 to-white border-r border-gray-200 p-6 ${className}`}>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-display font-bold gradient-text">
          Projects
        </h2>
        <Button 
          onClick={onAddProject}
          size="small"
          className="rounded-full p-2"
        >
          <ApperIcon name="Plus" className="h-4 w-4" />
        </Button>
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
            <motion.div
              key={project.Id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <ProjectCard
                project={project}
                isActive={activeProject?.Id === project.Id}
                taskCount={taskCounts[project.Id] || 0}
                onClick={() => onProjectSelect(project)}
              />
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
};

export default ProjectSidebar;