import React from 'react';
import { Palette, X } from 'lucide-react';
import { themeColors } from '../../constants/resumeConstants';

const ColorPickerModal = ({ 
  showColorPicker, 
  setShowColorPicker, 
  config, 
  setConfig 
}) => {
  if (!showColorPicker) return null;

  const activeTemplate = config?.activeTemplate || 'classic';
  const templates = config?.templates || {};
  const currentTemplateConfig = templates[activeTemplate] || {};

  return (
    <div className="fixed top-20 right-5 z-[100] w-72 animate-in fade-in slide-in-from-top-4 duration-300">
      <div className="bg-white rounded-xl shadow-2xl border border-zinc-200 overflow-hidden">
        <div className="bg-black text-white px-4 py-3 flex justify-between items-center">
          <h3 className="font-bold text-sm flex items-center gap-2">
            <Palette size={16} />
            选择主题配色
          </h3>
          <button onClick={() => setShowColorPicker(false)} className="hover:bg-white/20 p-0.5 rounded-full transition-colors">
            <X size={18} />
          </button>
        </div>
        <div className="p-4 grid grid-cols-4 gap-3 max-h-80 overflow-y-auto">
          {themeColors.map((color) => {
            const isActive = currentTemplateConfig.global?.themeColor === color.value;
            return (
              <button
                key={color.value}
                onClick={() => {
                  setConfig(prev => ({
                    ...prev,
                    templates: {
                      ...prev.templates,
                      [prev.activeTemplate]: {
                        ...prev.templates[prev.activeTemplate],
                        global: { ...prev.templates[prev.activeTemplate].global, themeColor: color.value }
                      }
                    }
                  }));
                }}
                className={`group relative flex flex-col items-center gap-1 transition-all ${isActive ? 'scale-110' : 'hover:scale-105'}`}
                title={color.name}
              >
                <div 
                  className={`w-10 h-10 rounded-full border-2 shadow-sm transition-all ${isActive ? 'border-black ring-2 ring-zinc-200' : 'border-transparent group-hover:border-zinc-300'}`}
                  style={{ backgroundColor: color.value }}
                />
                <span className={`text-[10px] truncate w-full text-center ${isActive ? 'font-bold text-black' : 'text-zinc-500'}`}>
                  {color.name}
                </span>
              </button>
            );
          })}
        </div>
        <div className="bg-zinc-50 px-4 py-2 border-t border-zinc-100">
          <p className="text-[10px] text-zinc-400 text-center italic">
            选中后将自动应用到标题装饰与列表标识
          </p>
        </div>
      </div>
    </div>
  );
};

export default ColorPickerModal;
