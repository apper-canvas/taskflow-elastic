import React from "react";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Card from "@/components/atoms/Card";

const Empty = ({ 
  title = "No data found",
  description = "Get started by creating your first item.",
  icon = "FileText",
  actionLabel,
  onAction,
  variant = "default",
  className = ""
}) => {
  if (variant === "fullscreen") {
    return (
      <div className={`flex-1 flex items-center justify-center bg-gradient-to-br from-gray-50 to-white p-6 ${className}`}>
        <div className="text-center max-w-md">
          <div className="mb-8">
            <div className="w-24 h-24 bg-gradient-to-br from-primary-100 to-accent-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <ApperIcon name={icon} className="h-12 w-12 text-primary-600" />
            </div>
            <h2 className="text-3xl font-display font-bold text-gray-900 mb-4">
              {title}
            </h2>
            <p className="text-gray-600 text-lg leading-relaxed">
              {description}
            </p>
          </div>
          
          {actionLabel && onAction && (
            <Button onClick={onAction} size="large" className="w-full">
              <ApperIcon name="Plus" className="h-5 w-5 mr-2" />
              {actionLabel}
            </Button>
          )}
        </div>
      </div>
    );
  }

  if (variant === "sidebar") {
    return (
      <div className={`text-center py-12 ${className}`}>
        <div className="w-16 h-16 bg-gradient-to-br from-primary-100 to-accent-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <ApperIcon name={icon} className="h-8 w-8 text-primary-600" />
        </div>
        <h3 className="text-lg font-display font-semibold text-gray-700 mb-2">
          {title}
        </h3>
        <p className="text-gray-500 text-sm mb-4 leading-relaxed">
          {description}
        </p>
        {actionLabel && onAction && (
          <Button onClick={onAction} size="small">
            <ApperIcon name="Plus" className="h-4 w-4 mr-2" />
            {actionLabel}
          </Button>
        )}
      </div>
    );
  }

  return (
    <Card variant="glass" className={`p-8 text-center ${className}`}>
      <div className="w-16 h-16 bg-gradient-to-br from-primary-100 to-accent-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <ApperIcon name={icon} className="h-8 w-8 text-primary-600" />
      </div>
      <h3 className="text-xl font-display font-semibold text-gray-900 mb-2">
        {title}
      </h3>
      <p className="text-gray-600 mb-6 leading-relaxed">
        {description}
      </p>
      {actionLabel && onAction && (
        <Button onClick={onAction}>
          <ApperIcon name="Plus" className="h-4 w-4 mr-2" />
          {actionLabel}
        </Button>
      )}
    </Card>
  );
};

export default Empty;