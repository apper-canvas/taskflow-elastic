import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import ProjectSidebar from "@/components/organisms/ProjectSidebar";
import MobileSidebar from "@/components/organisms/MobileSidebar";
import Header from "@/components/organisms/Header";
import KanbanBoard from "@/components/organisms/KanbanBoard";
import TaskModal from "@/components/organisms/TaskModal";
import ProjectModal from "@/components/organisms/ProjectModal";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import { projectService } from "@/services/api/projectService";
import { taskService } from "@/services/api/taskService";

const Dashboard = () => {
  const [projects, setProjects] = useState([]);
  const [activeProject, setActiveProject] = useState(null);
  const [taskCounts, setTaskCounts] = useState({});
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState({ priority: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Modal states
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [showProjectModal, setShowProjectModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [showMobileSidebar, setShowMobileSidebar] = useState(false);

  const loadProjects = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const projectsData = await projectService.getAll();
      setProjects(projectsData);
      
      // Load task counts
      const counts = {};
      for (const project of projectsData) {
        const tasks = await taskService.getByProject(project.Id);
        counts[project.Id] = tasks.length;
      }
      setTaskCounts(counts);
      
      // Set first project as active if none selected
      if (projectsData.length > 0 && !activeProject) {
        setActiveProject(projectsData[0]);
      }
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

  const handleProjectSelect = (project) => {
    setActiveProject(project);
  };

  const handleAddProject = () => {
    setShowProjectModal(true);
  };

  const handleAddTask = () => {
    if (!activeProject) return;
    setSelectedTask(null);
    setShowTaskModal(true);
  };

  const handleTaskClick = (task) => {
    setSelectedTask(task);
    setShowTaskModal(true);
  };

  const handleProjectSave = () => {
    loadProjects();
  };

  const handleTaskSave = () => {
    // Refresh will happen automatically through KanbanBoard
    setShowTaskModal(false);
    setSelectedTask(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white flex">
        <Loading variant="sidebar" />
        <Loading variant="board" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white flex">
        <Error variant="fullscreen" message={error} onRetry={loadProjects} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      {/* Mobile Header */}
      <div className="lg:hidden bg-white/90 backdrop-blur-md border-b border-gray-200 px-4 py-3">
        <div className="flex items-center justify-between">
          <button
            onClick={() => setShowMobileSidebar(true)}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ApperIcon name="Menu" className="h-6 w-6 text-gray-600" />
          </button>
          <h1 className="text-lg font-display font-bold gradient-text">
            TaskFlow
          </h1>
          <div className="w-10" /> {/* Spacer */}
        </div>
      </div>

      <div className="flex h-screen lg:h-screen">
        {/* Desktop Sidebar */}
        <div className="hidden lg:block">
          <ProjectSidebar
            activeProject={activeProject}
            onProjectSelect={handleProjectSelect}
            onAddProject={handleAddProject}
          />
        </div>

        {/* Mobile Sidebar */}
        <MobileSidebar
          isOpen={showMobileSidebar}
          onClose={() => setShowMobileSidebar(false)}
          projects={projects}
          activeProject={activeProject}
          onProjectSelect={handleProjectSelect}
          onAddProject={handleAddProject}
          taskCounts={taskCounts}
        />

        {/* Main Content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <Header
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            filters={filters}
            onFiltersChange={setFilters}
            onAddTask={handleAddTask}
            activeProject={activeProject}
          />

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="flex-1 overflow-hidden"
          >
            <KanbanBoard
              project={activeProject}
              searchQuery={searchQuery}
              filters={filters}
              onTaskClick={handleTaskClick}
            />
          </motion.div>
        </div>
      </div>

      {/* Modals */}
      <TaskModal
        isOpen={showTaskModal}
        onClose={() => {
          setShowTaskModal(false);
          setSelectedTask(null);
        }}
        task={selectedTask}
        projectId={activeProject?.Id}
        onSave={handleTaskSave}
      />

      <ProjectModal
        isOpen={showProjectModal}
        onClose={() => setShowProjectModal(false)}
        onSave={handleProjectSave}
      />
    </div>
  );
};

export default Dashboard;