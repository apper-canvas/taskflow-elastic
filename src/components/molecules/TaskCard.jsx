import React, { useState } from "react";
import { format, isAfter } from "date-fns";
import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";
import Badge from "@/components/atoms/Badge";
import Card from "@/components/atoms/Card";

const TaskCard = ({ 
  task, 
  onDragStart,
  onDragEnd,
  onClick,
  onTimeUpdate,
  className 
}) => {
  const [isEditingTime, setIsEditingTime] = useState(false);
  const [timeInput, setTimeInput] = useState(task.timeSpent || 0);
const handleTimeClick = (e) => {
    e.stopPropagation();
    setIsEditingTime(true);
    setTimeInput(task.timeSpent || 0);
  };

  const handleTimeSubmit = async (e) => {
    e.stopPropagation();
    if (e.key === 'Enter' || e.type === 'blur') {
      const newTime = Math.max(0, parseFloat(timeInput) || 0);
      setIsEditingTime(false);
      if (newTime !== task.timeSpent && onTimeUpdate) {
        await onTimeUpdate(task.Id, newTime);
      }
    }
    if (e.key === 'Escape') {
      setIsEditingTime(false);
      setTimeInput(task.timeSpent || 0);
    }
  };

  const getPriorityVariant = (priority) => {
    switch (priority) {
      case "high": return "high";
      case "medium": return "medium";
      case "low": return "low";
      default: return "default";
    }
};

  const formatTime = (hours) => {
    if (hours === 0) return "0h";
    if (hours < 1) return `${Math.round(hours * 60)}m`;
    const h = Math.floor(hours);
    const m = Math.round((hours - h) * 60);
    return m > 0 ? `${h}h ${m}m` : `${h}h`;
  };
  const isOverdue = task.dueDate && isAfter(new Date(), new Date(task.dueDate)) && task.status !== "done";

  const handleDragStart = (e) => {
    e.dataTransfer.setData("text/plain", task.Id.toString());
    e.target.classList.add("dragging");
    if (onDragStart) onDragStart(e);
  };

  const handleDragEnd = (e) => {
    e.target.classList.remove("dragging");
    if (onDragEnd) onDragEnd(e);
  };

  return (
    <Card
      variant="glass"
      className={cn(
        "task-card p-4 mb-3 cursor-grab active:cursor-grabbing transition-all duration-300",
        isOverdue && "ring-2 ring-error",
        className
      )}
      draggable
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onClick={onClick}
    >
      <div className="flex items-start justify-between mb-3">
        <h4 className="font-display font-semibold text-gray-900 text-sm leading-tight flex-1 mr-2">
          {task.title}
        </h4>
        <Badge variant={getPriorityVariant(task.priority)} size="small">
          {task.priority}
        </Badge>
      </div>

      {task.description && (
        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
          {task.description}
        </p>
      )}

      <div className="flex items-center justify-between text-xs text-gray-500">
        {task.dueDate && (
          <div className={cn(
            "flex items-center",
            isOverdue && "text-error font-medium"
          )}>
            <ApperIcon name="Calendar" className="h-3 w-3 mr-1" />
            <span>{format(new Date(task.dueDate), "MMM d")}</span>
          </div>
        )}
        
        <div className="flex items-center">
          <ApperIcon name="Clock" className="h-3 w-3 mr-1" />
          <span>{format(new Date(task.createdAt), "MMM d")}</span>
</div>
        
        {/* Time Tracking Widget */}
        <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
          <div className="flex items-center gap-2">
            <ApperIcon name="Clock" size={14} className="text-gray-500" />
            <span className="text-xs text-gray-500">Time:</span>
          </div>
          {isEditingTime ? (
            <input
              type="number"
              value={timeInput}
              onChange={(e) => setTimeInput(e.target.value)}
              onBlur={handleTimeSubmit}
              onKeyDown={handleTimeSubmit}
              onClick={(e) => e.stopPropagation()}
              className="w-16 px-1 py-0.5 text-xs border border-blue-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
              placeholder="0"
              step="0.25"
              min="0"
              autoFocus
            />
          ) : (
<button
              onClick={handleTimeClick}
              className="px-2 py-1 text-xs bg-gray-50 hover:bg-gray-100 rounded transition-colors"
            >
              {formatTime(task.timeSpent || 0)}
            </button>
          )}
        </div>
        
        {/* People Assignment */}
        {task.people && (
          <div className="flex items-center justify-between mt-2 pt-2 border-t border-gray-100">
            <div className="flex items-center gap-2">
              <ApperIcon name="User" size={14} className="text-gray-500" />
              <span className="text-xs text-gray-500">Assigned:</span>
            </div>
            <span className="text-xs text-gray-700 font-medium">{task.people}</span>
          </div>
        )}
      </div>
    </Card>
  );
};

export default TaskCard;