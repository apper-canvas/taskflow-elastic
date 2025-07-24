import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import ApperIcon from "@/components/ApperIcon";
import Card from "@/components/atoms/Card";
import Badge from "@/components/atoms/Badge";
import TaskCard from "@/components/molecules/TaskCard";
import ProgressRing from "@/components/molecules/ProgressRing";
import { taskService } from "@/services/api/taskService";

const KanbanBoard = ({ 
  project, 
  searchQuery = "",
  filters = {},
  onTaskClick,
  className 
}) => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [draggedTask, setDraggedTask] = useState(null);

  const columns = [
    { id: "todo", title: "To Do", color: "bg-gray-100", icon: "Circle" },
    { id: "inprogress", title: "In Progress", color: "bg-blue-100", icon: "Clock" },
    { id: "done", title: "Done", color: "bg-green-100", icon: "CheckCircle" }
  ];

  const loadTasks = async () => {
    if (!project) return;
    
    try {
      setLoading(true);
      setError(null);
      
      const tasksData = await taskService.getByProject(project.Id);
      setTasks(tasksData);
    } catch (err) {
      setError("Failed to load tasks");
      console.error("Error loading tasks:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTasks();
  }, [project]);

  const getFilteredTasks = (status) => {
    return tasks.filter(task => {
      const matchesStatus = task.status === status;
      const matchesSearch = !searchQuery || 
        task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        task.description.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesPriority = !filters.priority?.length || 
        filters.priority.includes(task.priority);
      
      return matchesStatus && matchesSearch && matchesPriority;
    });
  };

  const getColumnProgress = (status) => {
    const columnTasks = getFilteredTasks(status);
    if (columnTasks.length === 0) return 0;
    return status === "done" ? 100 : (columnTasks.length / tasks.length) * 100;
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.currentTarget.classList.add("drag-over");
  };

  const handleDragLeave = (e) => {
    e.currentTarget.classList.remove("drag-over");
  };

  const handleDrop = async (e, newStatus) => {
    e.preventDefault();
    e.currentTarget.classList.remove("drag-over");
    
    const taskId = parseInt(e.dataTransfer.getData("text/plain"));
    const task = tasks.find(t => t.Id === taskId);
    
    if (task && task.status !== newStatus) {
      try {
        const updatedTask = { ...task, status: newStatus };
        if (newStatus === "done" && !task.completedAt) {
          updatedTask.completedAt = new Date().toISOString();
        }
        
        await taskService.update(taskId, updatedTask);
        setTasks(prev => prev.map(t => t.Id === taskId ? updatedTask : t));
        
        toast.success(`Task moved to ${columns.find(c => c.id === newStatus)?.title}!`);
      } catch (err) {
        toast.error("Failed to update task");
        console.error("Error updating task:", err);
      }
    }
  };

  if (!project) {
    return (
      <div className={`flex-1 flex items-center justify-center bg-gradient-to-br from-gray-50 to-white ${className}`}>
        <div className="text-center">
          <ApperIcon name="FolderOpen" className="h-24 w-24 text-gray-300 mx-auto mb-6" />
          <h3 className="text-2xl font-display font-bold text-gray-700 mb-4">
            Select a Project
          </h3>
          <p className="text-gray-500 text-lg">
            Choose a project from the sidebar to view and manage tasks.
          </p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className={`flex-1 p-6 bg-gradient-to-br from-gray-50 to-white ${className}`}>
        <div className="grid md:grid-cols-3 gap-6 h-full">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="p-6">
              <div className="h-8 bg-gray-200 rounded animate-pulse mb-4"></div>
              <div className="space-y-3">
                {[1, 2, 3].map((j) => (
                  <div key={j} className="h-32 bg-gray-200 rounded animate-pulse shimmer"></div>
                ))}
              </div>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`flex-1 flex items-center justify-center bg-gradient-to-br from-gray-50 to-white ${className}`}>
        <div className="text-center">
          <ApperIcon name="AlertCircle" className="h-16 w-16 text-error mx-auto mb-4" />
          <h3 className="text-xl font-display font-bold text-error mb-4">
            {error}
          </h3>
          <button
            onClick={loadTasks}
            className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`flex-1 p-6 bg-gradient-to-br from-gray-50 to-white ${className}`}>
      <div className="mb-6">
        <h1 className="text-3xl font-display font-bold text-gray-900 mb-2">
          {project.name}
        </h1>
        <div className="flex items-center space-x-4">
          <Badge variant="primary" size="large">
            {tasks.length} Total Tasks
          </Badge>
          <Badge variant="success" size="large">
            {getFilteredTasks("done").length} Completed
          </Badge>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-6 h-[calc(100vh-12rem)]">
        {columns.map((column) => {
          const columnTasks = getFilteredTasks(column.id);
          const progress = getColumnProgress(column.id);
          
          return (
            <motion.div
              key={column.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
            >
              <Card 
                variant="glass" 
                className="h-full flex flex-col kanban-column"
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={(e) => handleDrop(e, column.id)}
              >
                <div className="p-4 border-b border-gray-200/50 flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-lg ${column.color}`}>
                      <ApperIcon name={column.icon} className="h-4 w-4 text-gray-600" />
                    </div>
                    <div>
                      <h3 className="font-display font-semibold text-gray-900">
                        {column.title}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {columnTasks.length} tasks
                      </p>
                    </div>
                  </div>
                  <ProgressRing progress={progress} size={40} strokeWidth={3} />
                </div>

                <div className="flex-1 p-4 overflow-y-auto">
                  {columnTasks.length === 0 ? (
                    <div className="text-center py-12">
                      <ApperIcon name="Plus" className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                      <p className="text-gray-500 text-sm">
                        {column.id === "todo" ? "Add tasks to get started" : `No ${column.title.toLowerCase()} tasks`}
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {columnTasks.map((task) => (
                        <motion.div
                          key={task.Id}
                          layout
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.8 }}
                          transition={{ duration: 0.2 }}
                        >
                          <TaskCard
                            task={task}
                            onClick={() => onTaskClick(task)}
                          />
                        </motion.div>
                      ))}
                    </div>
                  )}
                </div>
              </Card>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default KanbanBoard;