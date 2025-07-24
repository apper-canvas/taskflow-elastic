import React from "react";
import Card from "@/components/atoms/Card";

const Loading = ({ variant = "board", className = "" }) => {
  if (variant === "board") {
    return (
      <div className={`flex-1 p-6 bg-gradient-to-br from-gray-50 to-white ${className}`}>
        <div className="mb-6">
          <div className="h-8 bg-gray-200 rounded-lg mb-4 w-64 animate-pulse shimmer"></div>
          <div className="flex space-x-4">
            <div className="h-6 bg-gray-200 rounded-full w-24 animate-pulse shimmer"></div>
            <div className="h-6 bg-gray-200 rounded-full w-32 animate-pulse shimmer"></div>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6 h-[calc(100vh-12rem)]">
          {[1, 2, 3].map((i) => (
            <Card key={i} variant="glass" className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gray-200 rounded-lg animate-pulse shimmer"></div>
                  <div>
                    <div className="h-4 bg-gray-200 rounded w-20 mb-2 animate-pulse shimmer"></div>
                    <div className="h-3 bg-gray-200 rounded w-16 animate-pulse shimmer"></div>
                  </div>
                </div>
                <div className="w-10 h-10 bg-gray-200 rounded-full animate-pulse shimmer"></div>
              </div>

              <div className="space-y-3">
                {[1, 2, 3].map((j) => (
                  <Card key={j} className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="h-4 bg-gray-200 rounded w-32 animate-pulse shimmer"></div>
                      <div className="h-5 bg-gray-200 rounded-full w-16 animate-pulse shimmer"></div>
                    </div>
                    <div className="h-3 bg-gray-200 rounded w-full mb-2 animate-pulse shimmer"></div>
                    <div className="h-3 bg-gray-200 rounded w-3/4 mb-3 animate-pulse shimmer"></div>
                    <div className="flex justify-between">
                      <div className="h-3 bg-gray-200 rounded w-16 animate-pulse shimmer"></div>
                      <div className="h-3 bg-gray-200 rounded w-16 animate-pulse shimmer"></div>
                    </div>
                  </Card>
                ))}
              </div>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (variant === "sidebar") {
    return (
      <div className="w-80 bg-gradient-to-b from-gray-50 to-white border-r border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="h-6 bg-gray-200 rounded w-24 animate-pulse shimmer"></div>
          <div className="w-8 h-8 bg-gray-200 rounded-full animate-pulse shimmer"></div>
        </div>

        <div className="space-y-3">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="w-4 h-4 bg-gray-200 rounded-full animate-pulse shimmer"></div>
                <div className="h-4 bg-gray-200 rounded-full w-16 animate-pulse shimmer"></div>
              </div>
              <div className="h-5 bg-gray-200 rounded w-32 mb-2 animate-pulse shimmer"></div>
              <div className="h-3 bg-gray-200 rounded w-24 animate-pulse shimmer"></div>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className={`animate-pulse ${className}`}>
      <div className="h-4 bg-gray-200 rounded w-full shimmer"></div>
    </div>
  );
};

export default Loading;