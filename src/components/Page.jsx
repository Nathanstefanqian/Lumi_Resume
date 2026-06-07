import React from 'react';

/**
 * A4 页面容器组件
 */
const Page = ({ children, activeTemplate, templates }) => {
  const currentGlobal = templates[activeTemplate]?.global || {};
  const fontClass = activeTemplate === 'minimal' ? 'font-sans' : 'font-academic';
  
  return (
    <div 
      className={`print-area w-[210mm] h-[297mm] bg-white shadow-2xl relative overflow-hidden ${fontClass} text-[#1a1a1a] mb-10 flex flex-col shrink-0 group transition-all`}
      style={{ fontSize: `${currentGlobal.baseFontSize || 10.5}pt` }}
    >
      {/* 边距参考线 - 仅在 hover 时渐显，用于辅助编辑排版 */}
      <div className="absolute inset-8 border-2 border-dashed border-zinc-100 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-700 no-print z-0" />
      
      <div className="p-8 flex-1 flex flex-col relative z-10">{children}</div>
    </div>
  );
};

export default Page;
