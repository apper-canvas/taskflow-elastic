import React from "react";
import Card from "@/components/atoms/Card";
import Badge from "@/components/atoms/Badge";
import ApperIcon from "@/components/ApperIcon";
import { cn } from "@/utils/cn";
import { format, isAfter } from "date-fns";

const TaskCard = ({ 
  task, 
  onDragStart,
  onDragEnd,
  onClick,
  className 
}) => {
  const getPriorityVariant = (priority) => {
    switch (priority) {
      case "high": return "high";
      case "medium": return "medium";
      case "low": return "low";
      default: return "default";
    }
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
      </div>
    </Card>
  );
};

export default TaskCard;