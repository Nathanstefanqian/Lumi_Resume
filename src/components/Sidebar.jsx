import React, { useState } from 'react';
import { Settings, RotateCcw, ChevronLeft, Library, Palette, Sparkles, User, LogOut, LogIn, X } from 'lucide-react';
import { templates, themeColors } from '../constants/resumeConstants';
import ResumeLibrary from './ResumeLibrary';

const Sidebar = ({ config, setConfig, isDirty, onClose, currentResumeId, onSelectResume, onDuplicateResume, onDeleteResume, onCreateNewResume, user, onLogout, resumes }) => {
  const [activeTab, setActiveTab] = useState('library'); // 默认选中 'library'

  return (
    <div className="w-full md:w-72 bg-white border-r border-zinc-300 h-full md:h-screen sticky top-0 overflow-hidden flex flex-col shrink-0 z-[60] relative shadow-2xl md:shadow-none">
      <button 
        onClick={onClose}
        className="absolute top-6 right-4 p-2.5 text-zinc-400 hover:text-black hover:bg-zinc-100 transition-all z-10 bg-zinc-50 rounded-full md:hidden"
        title="关闭侧边栏"
      >
        <X size={20} />
      </button>

      {/* 用户信息与登录 */}
      <div className="p-6 pb-2 shrink-0">
        {user && (
          <div className="flex items-center justify-between p-3 bg-zinc-50 rounded-2xl border border-zinc-100 group relative">
            <div className="flex items-center gap-3 overflow-hidden">
              <div className="w-10 h-10 rounded-xl bg-black flex items-center justify-center text-white font-black shrink-0 shadow-lg">
                {user.avatar ? (
                  <img src={user.avatar} alt="avatar" className="w-full h-full object-cover rounded-xl" onError={(e) => {
                    e.target.onerror = null;
                    e.target.style.display = 'none';
                    e.target.parentElement.innerHTML = user.username?.[0]?.toUpperCase() || 'L';
                  }} />
                ) : (
                  user.username?.[0]?.toUpperCase() || 'L'
                )}
              </div>
              <div className="flex flex-col overflow-hidden">
                <span className="font-black text-sm text-zinc-800 truncate">{user.username || 'Lumi'}</span>
                <span className="text-[10px] text-zinc-400 truncate">{user.email || 'test@lumi.com'}</span>
              </div>
            </div>
            <button 
              onClick={onLogout}
              className="p-2 text-zinc-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all active:scale-90"
              title="退出登录"
            >
              <LogOut size={16} />
            </button>
          </div>
        )}
      </div>

      {/* 侧边栏导航 Tab */}
      <div className="px-6 py-4 flex gap-2 shrink-0">
        <button 
          onClick={() => setActiveTab('library')}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-black transition-all ${activeTab === 'library' ? 'bg-black text-white shadow-lg' : 'bg-zinc-100 text-zinc-400 hover:bg-zinc-200'}`}
        >
          <Library size={14} /> 简历库
        </button>
        <button 
          onClick={() => setActiveTab('templates')}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-black transition-all ${activeTab === 'templates' ? 'bg-black text-white shadow-lg' : 'bg-zinc-100 text-zinc-400 hover:bg-zinc-200'}`}
        >
          <Palette size={14} /> 风格模版
        </button>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar px-6 pb-6">
        {activeTab === 'templates' ? (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
            <div className="flex flex-col gap-4">
              <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest mb-1">选择简历风格</p>
              {templates.map((tpl) => (
                <button
                  key={tpl.id}
                  onClick={() => {
                    setConfig(prev => ({
                      ...prev,
                      activeTemplate: tpl.id
                    }));
                  }}
                  className={`group relative p-4 rounded-2xl border-2 transition-all text-left flex flex-col gap-2 ${
                    config.activeTemplate === tpl.id 
                      ? 'border-black bg-zinc-50 shadow-lg' 
                      : 'border-zinc-100 hover:border-zinc-300 bg-white'
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <span className="text-2xl">{tpl.icon}</span>
                    {config.activeTemplate === tpl.id && (
                      <div className="w-2 h-2 rounded-full bg-black animate-pulse" />
                    )}
                  </div>
                  <div>
                    <h3 className={`font-bold text-sm ${config.activeTemplate === tpl.id ? 'text-black' : 'text-zinc-700'}`}>
                      {tpl.name}
                    </h3>
                    <p className="text-[10px] text-zinc-400 leading-relaxed">{tpl.desc}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="animate-in fade-in slide-in-from-bottom-2 duration-300 h-full flex flex-col">
            <ResumeLibrary 
              currentResumeId={currentResumeId}
              onSelect={onSelectResume}
              onDuplicate={onDuplicateResume}
              onDelete={onDeleteResume}
              onCreateNew={onCreateNewResume}
              externalResumes={resumes}
            />
          </div>
        )}
      </div>

      <div className="p-6 border-t border-zinc-100 bg-white">
        <div className="bg-zinc-50 rounded-xl p-4 flex flex-col gap-3">
          <h4 className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">当前状态</h4>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: config.templates?.[config.activeTemplate]?.global?.themeColor || '#1a1a1a' }} />
            <span className="text-xs font-bold text-zinc-700">
              {themeColors.find(c => c.value === config.templates?.[config.activeTemplate]?.global?.themeColor)?.name || '自定义'}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <RotateCcw size={12} className="text-zinc-400" />
            <span className="text-xs font-bold text-zinc-700">
              {isDirty ? '有未保存修改' : '已同步至云端'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
