import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import { projectService } from "@/services/api/projectService";

const ProjectModal = ({ 
  isOpen, 
  onClose, 
  project = null,
  onSave 
}) => {
  const [formData, setFormData] = useState({
    name: "",
    color: "#8B5CF6"
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const colors = [
    "#8B5CF6", "#3B82F6", "#10B981", "#F59E0B", 
    "#EF4444", "#EC4899", "#8B5A2B", "#6B7280"
  ];

  useEffect(() => {
    if (project) {
      setFormData({
        name: project.name || "",
        color: project.color || "#8B5CF6"
      });
    } else {
      setFormData({
        name: "",
        color: "#8B5CF6"
      });
    }
    setErrors({});
  }, [project, isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  const handleColorSelect = (color) => {
    setFormData(prev => ({ ...prev, color }));
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = "Project name is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    try {
      setLoading(true);
      
      const projectData = {
        ...formData,
        name: formData.name.trim(),
        ...(project ? {} : { 
          createdAt: new Date().toISOString(),
          taskCount: 0
        })
      };

      if (project) {
        await projectService.update(project.Id, projectData);
        toast.success("Project updated successfully!");
      } else {
        await projectService.create(projectData);
        toast.success("Project created successfully!");
      }

      onSave();
      onClose();
    } catch (err) {
      toast.error(project ? "Failed to update project" : "Failed to create project");
      console.error("Error saving project:", err);
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
        className="bg-white rounded-2xl shadow-premium-hover max-w-md w-full"
      >
        <div className="border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-display font-bold text-gray-900">
              {project ? "Edit Project" : "Create Project"}
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
            label="Project Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            error={errors.name}
            placeholder="Enter project name..."
            required
          />

          <div className="space-y-3">
            <label className="block text-sm font-medium text-gray-700">
              Project Color
            </label>
            <div className="grid grid-cols-8 gap-2">
              {colors.map((color) => (
                <button
                  key={color}
                  type="button"
                  onClick={() => handleColorSelect(color)}
                  className={`w-8 h-8 rounded-full transition-all duration-200 ${
                    formData.color === color 
                      ? "ring-2 ring-primary-500 ring-offset-2 scale-110" 
                      : "hover:scale-105"
                  }`}
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
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
                  <ApperIcon name={project ? "Save" : "Plus"} className="h-4 w-4 mr-2" />
                  {project ? "Update" : "Create"}
                </>
              )}
            </Button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default ProjectModal;