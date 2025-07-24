import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import Textarea from "@/components/atoms/Textarea";
import Select from "@/components/atoms/Select";
import { taskService } from "@/services/api/taskService";

const TaskModal = ({ 
  isOpen, 
  onClose, 
  task = null, 
  projectId,
  onSave 
}) => {
const [formData, setFormData] = useState({
    title: "",
    description: "",
    priority: "medium",
    dueDate: "",
    status: "todo",
    timeSpent: 0
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
if (task) {
      setFormData({
        title: task.title || "",
        description: task.description || "",
        priority: task.priority || "medium",
        dueDate: task.dueDate ? task.dueDate.split("T")[0] : "",
        status: task.status || "todo",
        timeSpent: task.timeSpent || 0
      });
    } else {
      setFormData({
        title: "",
        description: "",
        priority: "medium",
        dueDate: "",
        status: "todo",
        timeSpent: 0
      });
    }
    setErrors({});
  }, [task, isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.title.trim()) {
      newErrors.title = "Title is required";
    }
    
    if (formData.dueDate && new Date(formData.dueDate) < new Date()) {
      newErrors.dueDate = "Due date cannot be in the past";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    try {
      setLoading(true);
      
      const taskData = {
        ...formData,
        projectId: projectId,
        dueDate: formData.dueDate ? new Date(formData.dueDate).toISOString() : null,
        ...(task ? {} : { createdAt: new Date().toISOString() })
      };

      if (task) {
        await taskService.update(task.Id, taskData);
        toast.success("Task updated successfully!");
      } else {
        await taskService.create(taskData);
        toast.success("Task created successfully!");
      }

      onSave();
      onClose();
    } catch (err) {
      toast.error(task ? "Failed to update task" : "Failed to create task");
      console.error("Error saving task:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!task || !window.confirm("Are you sure you want to delete this task?")) return;

    try {
      setLoading(true);
      await taskService.delete(task.Id);
      toast.success("Task deleted successfully!");
      onSave();
      onClose();
    } catch (err) {
      toast.error("Failed to delete task");
      console.error("Error deleting task:", err);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.2 }}
        className="bg-white rounded-2xl shadow-premium-hover max-w-lg w-full max-h-[90vh] overflow-y-auto"
      >
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 rounded-t-2xl">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-display font-bold text-gray-900">
              {task ? "Edit Task" : "Create Task"}
            </h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ApperIcon name="X" className="h-5 w-5 text-gray-500" />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <Input
            label="Task Title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            error={errors.title}
            placeholder="Enter task title..."
            required
          />

          <Textarea
            label="Description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Enter task description..."
            rows={4}
          />

          <div className="grid grid-cols-2 gap-4">
            <Select
              label="Priority"
              name="priority"
              value={formData.priority}
              onChange={handleChange}
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </Select>

            <Select
              label="Status"
              name="status"
              value={formData.status}
              onChange={handleChange}
            >
              <option value="todo">To Do</option>
              <option value="inprogress">In Progress</option>
              <option value="done">Done</option>
            </Select>
          </div>

          <Input
            label="Due Date"
            name="dueDate"
            type="date"
            value={formData.dueDate}
            onChange={handleChange}
            error={errors.dueDate}
min={new Date().toISOString().split("T")[0]}
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Time Spent (hours)
            </label>
            <Input
              type="number"
              name="timeSpent"
              value={formData.timeSpent}
              onChange={handleChange}
              placeholder="0"
              step="0.25"
              min="0"
              className="w-full"
            />
          </div>
          <div className="flex items-center justify-between pt-4 border-t border-gray-200">
            <div>
              {task && (
                <Button
                  type="button"
                  variant="danger"
                  onClick={handleDelete}
                  disabled={loading}
                  size="medium"
                >
                  <ApperIcon name="Trash2" className="h-4 w-4 mr-2" />
                  Delete
                </Button>
              )}
            </div>
            
            <div className="flex space-x-3">
              <Button
                type="button"
                variant="ghost"
                onClick={onClose}
                disabled={loading}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={loading}
                className="min-w-[100px]"
              >
                {loading ? (
                  <ApperIcon name="Loader2" className="h-4 w-4 animate-spin" />
                ) : (
                  <>
                    <ApperIcon name={task ? "Save" : "Plus"} className="h-4 w-4 mr-2" />
                    {task ? "Update" : "Create"}
                  </>
                )}
              </Button>
            </div>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default TaskModal;