// app/components/SimpleTabs.tsx
import React from "react";
import clsx from "clsx";

interface TabItem {
  title: string;
  content: React.ReactNode;
}

interface SimpleTabsProps {
  tabs: TabItem[];
  activeIndex: number;
  onTabChange: (index: number) => void;
}

export function SimpleTabs({ tabs, activeIndex, onTabChange }: SimpleTabsProps) {
  // 直接處理點擊事件
  const handleClick = (index: number) => {
    console.log("Tab clicked:", index);
    onTabChange(index);
  };

  return (
    <div className="w-full">
      <div className="border-b border-gray-200">
        <div className="flex -mb-px">
          {tabs.map((tab, index) => (
            <button
              key={index}
              type="button"
              className={clsx(
                "py-4 px-6 text-center border-b-2 font-medium text-sm focus:outline-none",
                activeIndex === index
                  ? "border-primary-500 text-primary-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              )}
              onClick={() => handleClick(index)}
            >
              {tab.title}
            </button>
          ))}
        </div>
      </div>
      <div className="mt-4">
        {tabs[activeIndex]?.content || tabs[0].content}
      </div>
    </div>
  );
}