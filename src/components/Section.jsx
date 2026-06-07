import React from 'react';

/**
 * 板块容器组件
 */
const Section = ({ title, children, className = "", style = {}, moduleId, config, getModuleConfig }) => {
  const currentConfig = getModuleConfig(moduleId || 'global');
  const template = config?.activeTemplate || 'classic';
  const templates = config?.templates || {};
  const currentTemplateConfig = templates[template] || {};
  const globalConfig = currentTemplateConfig.global || { themeColor: '#1a1a1a' };
  
  return (
    <section 
      style={{ marginBottom: `${currentConfig.sectionSpacing}px`, ...style }} 
      className={`${className} flex flex-col w-full`}
    >
      <div 
        style={{ marginBottom: `${currentConfig.contentSpacing}px` }} 
        className="flex items-center w-full"
      >
        {template === 'classic' && (
          <div 
            className="flex items-center rounded-r-lg py-1 relative overflow-hidden group w-full"
            style={{ backgroundColor: `${globalConfig.themeColor}10` }} // 10% 透明度背景
          >
            <div 
              className="w-1.5 h-6 absolute left-0 top-1/2 -translate-y-1/2 rounded-r-sm" 
              style={{ backgroundColor: globalConfig.themeColor }}
            />
            <div 
              className="pl-5 font-bold tracking-wider"
              style={{ 
                fontSize: `${currentConfig.titleFontSize}pt`,
                color: globalConfig.themeColor
              }}
            >
              {title}
            </div>
          </div>
        )}

        {template === 'modern' && (
          <div className="flex items-center w-full gap-4">
            <div 
              className="font-bold tracking-widest whitespace-nowrap"
              style={{ 
                fontSize: `${currentConfig.titleFontSize}pt`,
                color: globalConfig.themeColor
              }}
            >
              {title}
            </div>
            <div 
              className="flex-1 h-[1px]" 
              style={{ backgroundColor: `${globalConfig.themeColor}30` }}
            />
          </div>
        )}

        {template === 'minimal' && (
          <div className="flex flex-col w-full">
            <div 
              className="font-black tracking-tight uppercase"
              style={{ 
                fontSize: `${currentConfig.titleFontSize + 1}pt`,
                color: '#1a1a1a',
                borderBottom: `2px solid ${globalConfig.themeColor}`
              }}
            >
              {title}
            </div>
          </div>
        )}
      </div>
      <div className="px-1" style={{ fontSize: `${currentConfig.baseFontSize}pt` }}>{children}</div>
    </section>
  );
};

export default Section;
