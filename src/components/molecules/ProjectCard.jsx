import React from "react";
import Card from "@/components/atoms/Card";
import Badge from "@/components/atoms/Badge";
import ApperIcon from "@/components/ApperIcon";
import { cn } from "@/utils/cn";
import { format } from "date-fns";

const ProjectCard = ({ 
  project, 
  isActive = false, 
  onClick,
  taskCount = 0,
  className 
}) => {
  return (
    <Card
      variant={isActive ? "gradient" : "default"}
      className={cn(
        "p-4 cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-premium-hover",
        isActive && "ring-2 ring-primary-500",
        className
      )}
      onClick={onClick}
    >
      <div className="flex items-center justify-between mb-3">
        <div 
          className="w-4 h-4 rounded-full shadow-lg"
          style={{ backgroundColor: project.color }}
        />
        <Badge variant="default" size="small">
          {taskCount} tasks
        </Badge>
      </div>
      
      <h3 className={cn(
        "font-display font-semibold text-lg mb-2 truncate",
        isActive ? "text-white" : "text-gray-900"
      )}>
        {project.name}
      </h3>
      
      <div className="flex items-center text-sm text-gray-500">
        <ApperIcon name="Calendar" className="h-4 w-4 mr-1" />
        <span className={isActive ? "text-white/80" : ""}>
          {format(new Date(project.createdAt), "MMM d, yyyy")}
        </span>
      </div>
    </Card>
  );
};

export default ProjectCard;