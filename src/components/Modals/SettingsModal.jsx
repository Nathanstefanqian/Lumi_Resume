import React from 'react';
import { Settings, X, RotateCcw } from 'lucide-react';

const SettingsModal = ({ 
  showSettings, 
  setShowSettings, 
  activeModule, 
  setActiveModule, 
  config, 
  setConfig 
}) => {
  if (!showSettings) return null;

  const activeTemplate = config?.activeTemplate || 'classic';
  const templates = config?.templates || {};
  const currentTemplateConfig = templates[activeTemplate] || {};
  const globalConfig = currentTemplateConfig.global || {};

  return (
    <div className="fixed top-20 right-5 z-[100] w-full max-w-md animate-in fade-in slide-in-from-top-4 duration-300">
      <div className="bg-white rounded-xl shadow-2xl border border-zinc-200 overflow-hidden">
        <div className="bg-black text-white px-6 py-4 flex justify-between items-center">
          <h3 className="font-bold text-lg flex items-center gap-2">
            <Settings size={20} />
            简历排版设置
          </h3>
          <button onClick={() => setShowSettings(false)} className="hover:bg-white/20 p-1 rounded-full transition-colors">
            <X size={24} />
          </button>
        </div>

        {/* 模块选择 Tab */}
        <div className="flex border-b border-zinc-100 bg-zinc-50/50 p-1 flex-wrap">
          {[
            { id: 'global', label: '全局' },
            { id: 'personal_info', label: '基本信息' },
            { id: 'self_evaluation', label: '自我评价' },
            { id: 'education_background', label: '教育背景' },
            { id: 'project_experience', label: '项目经历' },
            { id: 'internship_experience', label: '实习经历' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveModule(tab.id)}
              className={`px-3 py-2 text-xs font-bold rounded-lg transition-all ${
                activeModule === tab.id 
                  ? 'bg-white shadow-sm text-black border border-zinc-200' 
                  : 'text-zinc-400 hover:text-zinc-600'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
        
        <div className="p-6 space-y-6 max-h-[60vh] overflow-y-auto">
          {/* 模块重置按钮 (非全局 Tab 显示) */}
          {activeModule !== 'global' && (
            <button 
              onClick={() => setConfig(prev => ({ 
                ...prev, 
                templates: {
                  ...prev.templates,
                  [prev.activeTemplate]: {
                    ...prev.templates[prev.activeTemplate],
                    [activeModule]: {}
                  }
                }
              }))}
              className="w-full py-2 text-xs font-bold text-zinc-500 border border-zinc-200 rounded-lg hover:bg-zinc-50 transition-all flex items-center justify-center gap-2"
            >
              <RotateCcw size={14} />
              恢复当前模块为全局设置
            </button>
          )}

          {/* 字体大小 (全局或特定模块) */}
          <div className="grid grid-cols-2 gap-4 pb-4 border-b border-zinc-100">
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-sm font-medium">正文字体 (pt)</label>
                {activeModule !== 'global' && currentTemplateConfig[activeModule]?.baseFontSize === undefined && (
                  <span className="text-[10px] text-zinc-400 font-bold bg-zinc-100 px-1.5 py-0.5 rounded">继承全局</span>
                )}
              </div>
              <input 
                type="number" step="0.5"
                value={currentTemplateConfig[activeModule]?.baseFontSize ?? globalConfig.baseFontSize}
                onChange={(e) => {
                  const val = parseFloat(e.target.value);
                  setConfig(prev => ({ 
                    ...prev, 
                    templates: {
                      ...prev.templates,
                      [prev.activeTemplate]: {
                        ...prev.templates[prev.activeTemplate],
                        [activeModule]: { ...(prev.templates[prev.activeTemplate][activeModule] || {}), baseFontSize: val }
                      }
                    }
                  }));
                }}
                className="w-full border border-zinc-200 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black/10"
              />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-sm font-medium">标题字体 (pt)</label>
                {activeModule !== 'global' && currentTemplateConfig[activeModule]?.titleFontSize === undefined && (
                  <span className="text-[10px] text-zinc-400 font-bold bg-zinc-100 px-1.5 py-0.5 rounded">继承全局</span>
                )}
              </div>
              <input 
                type="number" step="0.5"
                value={currentTemplateConfig[activeModule]?.titleFontSize ?? globalConfig.titleFontSize}
                onChange={(e) => {
                  const val = parseFloat(e.target.value);
                  setConfig(prev => ({ 
                    ...prev, 
                    templates: {
                      ...prev.templates,
                      [prev.activeTemplate]: {
                        ...prev.templates[prev.activeTemplate],
                        [activeModule]: { ...(prev.templates[prev.activeTemplate][activeModule] || {}), titleFontSize: val }
                      }
                    }
                  }));
                }}
                className="w-full border border-zinc-200 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black/10"
              />
            </div>
          </div>

          {/* 间距控制 */}
          <div className="space-y-4">
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <label className="text-sm font-medium">板块垂直间距 (px)</label>
                  {activeModule !== 'global' && currentTemplateConfig[activeModule]?.sectionSpacing === undefined && (
                    <span className="text-[10px] text-zinc-400 font-bold bg-zinc-100 px-1.5 py-0.5 rounded">继承全局</span>
                  )}
                </div>
                <span className="text-xs text-zinc-400 font-bold">{currentTemplateConfig[activeModule]?.sectionSpacing ?? globalConfig.sectionSpacing}px</span>
              </div>
              <input 
                type="range" min="0" max="100" step="1"
                value={currentTemplateConfig[activeModule]?.sectionSpacing ?? globalConfig.sectionSpacing}
                onChange={(e) => {
                  const val = parseInt(e.target.value);
                  setConfig(prev => ({ 
                    ...prev, 
                    templates: {
                      ...prev.templates,
                      [prev.activeTemplate]: {
                        ...prev.templates[prev.activeTemplate],
                        [activeModule]: { ...(prev.templates[prev.activeTemplate][activeModule] || {}), sectionSpacing: val }
                      }
                    }
                  }));
                }}
                className="w-full accent-black h-2 bg-zinc-100 rounded-lg appearance-none cursor-pointer"
              />
            </div>

            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <label className="text-sm font-medium">板块标题下方间距 (px)</label>
                  {activeModule !== 'global' && currentTemplateConfig[activeModule]?.contentSpacing === undefined && (
                    <span className="text-[10px] text-zinc-400 font-bold bg-zinc-100 px-1.5 py-0.5 rounded">继承全局</span>
                  )}
                </div>
                <span className="text-xs text-zinc-400 font-bold">{currentTemplateConfig[activeModule]?.contentSpacing ?? globalConfig.contentSpacing}px</span>
              </div>
              <input 
                type="range" min="0" max="40" step="1"
                value={currentTemplateConfig[activeModule]?.contentSpacing ?? globalConfig.contentSpacing}
                onChange={(e) => {
                  const val = parseInt(e.target.value);
                  setConfig(prev => ({ 
                    ...prev, 
                    templates: {
                      ...prev.templates,
                      [prev.activeTemplate]: {
                        ...prev.templates[prev.activeTemplate],
                        [activeModule]: { ...(prev.templates[prev.activeTemplate][activeModule] || {}), contentSpacing: val }
                      }
                    }
                  }));
                }}
                className="w-full accent-black h-2 bg-zinc-100 rounded-lg appearance-none cursor-pointer"
              />
            </div>

            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <label className="text-sm font-medium">列表/条目垂直间距 (px)</label>
                  {activeModule !== 'global' && currentTemplateConfig[activeModule]?.itemSpacing === undefined && (
                    <span className="text-[10px] text-zinc-400 font-bold bg-zinc-100 px-1.5 py-0.5 rounded">继承全局</span>
                  )}
                </div>
                <span className="text-xs text-zinc-400 font-bold">{currentTemplateConfig[activeModule]?.itemSpacing ?? globalConfig.itemSpacing}px</span>
              </div>
              <input 
                type="range" min="0" max="40" step="1"
                value={currentTemplateConfig[activeModule]?.itemSpacing ?? globalConfig.itemSpacing}
                onChange={(e) => {
                  const val = parseInt(e.target.value);
                  setConfig(prev => ({ 
                    ...prev, 
                    templates: {
                      ...prev.templates,
                      [prev.activeTemplate]: {
                        ...prev.templates[prev.activeTemplate],
                        [activeModule]: { ...(prev.templates[prev.activeTemplate][activeModule] || {}), itemSpacing: val }
                      }
                    }
                  }));
                }}
                className="w-full accent-black h-2 bg-zinc-100 rounded-lg appearance-none cursor-pointer"
              />
            </div>

            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <label className="text-sm font-medium">子项间距 (px)</label>
                  {activeModule !== 'global' && currentTemplateConfig[activeModule]?.subItemSpacing === undefined && (
                    <span className="text-[10px] text-zinc-400 font-bold bg-zinc-100 px-1.5 py-0.5 rounded">继承全局</span>
                  )}
                </div>
                <span className="text-xs text-zinc-400 font-bold">{currentTemplateConfig[activeModule]?.subItemSpacing ?? globalConfig.subItemSpacing}px</span>
              </div>
              <input 
                type="range" min="0" max="20" step="1"
                value={currentTemplateConfig[activeModule]?.subItemSpacing ?? globalConfig.subItemSpacing}
                onChange={(e) => {
                  const val = parseInt(e.target.value);
                  setConfig(prev => ({ 
                    ...prev, 
                    templates: {
                      ...prev.templates,
                      [prev.activeTemplate]: {
                        ...prev.templates[prev.activeTemplate],
                        [activeModule]: { ...(prev.templates[prev.activeTemplate][activeModule] || {}), subItemSpacing: val }
                      }
                    }
                  }));
                }}
                className="w-full accent-black h-2 bg-zinc-100 rounded-lg appearance-none cursor-pointer"
              />
            </div>
          </div>
        </div>

        <div className="p-6 bg-zinc-50 border-t border-zinc-100">
          <button 
            onClick={() => {
              const defaultConfig = {
                sectionSpacing: 40,
                contentSpacing: 12,
                itemSpacing: 8,
                subItemSpacing: 4,
                baseFontSize: 9.5,
                titleFontSize: 11,
                themeColor: '#1a1a1a',
              };
              setConfig(prev => ({
                ...prev,
                templates: {
                  ...prev.templates,
                  [prev.activeTemplate]: {
                    global: { ...defaultConfig },
                    personal_info: { sectionSpacing: 14 },
                    self_evaluation: { sectionSpacing: 17 },
                    education_background: { sectionSpacing: 25 },
                    project_experience: { sectionSpacing: 31 },
                    internship_experience: { sectionSpacing: 38 },
                  }
                }
              }));
            }}
            className="w-full py-2 text-xs font-bold text-red-500 hover:text-red-600 transition-colors"
          >
            重置当前模版排版到初始默认
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;
