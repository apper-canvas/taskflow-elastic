import React from "react";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Card from "@/components/atoms/Card";

const Error = ({ 
  message = "Something went wrong",
  onRetry,
  variant = "default",
  className = ""
}) => {
  if (variant === "fullscreen") {
    return (
      <div className={`flex-1 flex items-center justify-center bg-gradient-to-br from-gray-50 to-white p-6 ${className}`}>
        <Card variant="glass" className="p-12 text-center max-w-md">
          <div className="mb-6">
            <ApperIcon name="AlertTriangle" className="h-20 w-20 text-error mx-auto mb-4" />
            <h2 className="text-2xl font-display font-bold text-gray-900 mb-2">
              Oops! Something went wrong
            </h2>
            <p className="text-gray-600 text-lg">
              {message}
            </p>
          </div>
          
          {onRetry && (
            <Button onClick={onRetry} className="w-full">
              <ApperIcon name="RefreshCw" className="h-4 w-4 mr-2" />
              Try Again
            </Button>
          )}
        </Card>
      </div>
    );
  }

  if (variant === "sidebar") {
    return (
      <div className={`w-80 bg-gradient-to-b from-gray-50 to-white border-r border-gray-200 p-6 ${className}`}>
        <div className="text-center py-12">
          <ApperIcon name="AlertCircle" className="h-16 w-16 text-error mx-auto mb-4" />
          <h3 className="text-lg font-display font-semibold text-gray-900 mb-2">
            Unable to Load
          </h3>
          <p className="text-gray-600 text-sm mb-6">
            {message}
          </p>
          {onRetry && (
            <Button onClick={onRetry} variant="outline" size="small">
              <ApperIcon name="RefreshCw" className="h-4 w-4 mr-2" />
              Retry
            </Button>
          )}
        </div>
      </div>
    );
  }

  return (
    <Card variant="glass" className={`p-6 text-center ${className}`}>
      <ApperIcon name="AlertCircle" className="h-12 w-12 text-error mx-auto mb-4" />
      <h3 className="text-lg font-display font-semibold text-gray-900 mb-2">
        Error
      </h3>
      <p className="text-gray-600 mb-4">
        {message}
      </p>
      {onRetry && (
        <Button onClick={onRetry} variant="outline" size="small">
          <ApperIcon name="RefreshCw" className="h-4 w-4 mr-2" />
          Try Again
        </Button>
      )}
    </Card>
  );
};

export default Error;