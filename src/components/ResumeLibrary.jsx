import React, { useState, useEffect, useCallback } from 'react';
import { Plus, FileText, Clock, Copy, Trash2, Edit3 } from 'lucide-react';
import request from '../utils/request';

const ResumeLibrary = ({ currentResumeId, onSelect, onDuplicate, onDelete, onCreateNew, externalResumes }) => {
  const [internalResumes, setInternalResumes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState('');

  const fetchResumes = useCallback(async () => {
    try {
      setLoading(true);
      const resData = await request.get('/api/resumes');
      setInternalResumes(Array.isArray(resData) ? resData : []);
    } catch {
      // 错误处理
    } finally {
      setLoading(false);
    }
  }, []);

  // 决定最终使用的简历列表：优先使用外部传入的数据，并确保其为数组
  const resumes = Array.isArray(externalResumes) ? externalResumes : internalResumes;

  useEffect(() => {
    // 只有在没有外部传入数据时才自行获取
    if (!externalResumes) {
      fetchResumes();
    }
  }, [externalResumes, fetchResumes, currentResumeId]);

  const handleRename = async (id) => {
    if (!editName.trim()) return;
    try {
      await request.put(`/api/resumes/${id}`, { name: editName });
      setEditingId(null);
      fetchResumes();
    } catch {
      // 错误处理
    }
  };

  const wrapAction = async (action, ...args) => {
    await action(...args);
    fetchResumes(); // 操作完成后刷新列表
  };

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center py-10">
        <div className="w-6 h-6 border-2 border-zinc-200 border-t-black rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col gap-4 overflow-hidden">
      <button
        onClick={() => wrapAction(onCreateNew)}
        className="w-full py-4 border-2 border-dashed border-zinc-200 rounded-2xl text-zinc-400 hover:border-zinc-300 hover:text-zinc-600 transition-all flex items-center justify-center gap-2 font-bold text-sm shrink-0"
      >
        <Plus size={18} /> 从零创建新简历
      </button>

      <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar space-y-3">
        {resumes.length === 0 ? (
          <div className="text-center py-10 text-zinc-400 text-xs">
            暂无简历，点击上方按钮创建
          </div>
        ) : (
          resumes.map((resume) => (
            <div
              key={resume.id}
              className={`group relative p-4 rounded-2xl border-2 transition-all cursor-pointer ${
                currentResumeId === resume.id 
                  ? 'border-black bg-zinc-50 shadow-md' 
                  : 'border-zinc-100 hover:border-zinc-300 bg-white'
              }`}
              onClick={() => onSelect(resume.id)}
            >
              <div className="flex flex-col gap-1">
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-2 overflow-hidden flex-1">
                    <FileText size={14} className={currentResumeId === resume.id ? 'text-black' : 'text-zinc-400'} />
                    {editingId === resume.id ? (
                      <input
                        autoFocus
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        onBlur={() => handleRename(resume.id)}
                        onKeyDown={(e) => e.key === 'Enter' && handleRename(resume.id)}
                        onClick={(e) => e.stopPropagation()}
                        className="font-bold text-sm bg-white border border-zinc-300 px-1 rounded w-full outline-none"
                      />
                    ) : (
                      <h3 className={`font-bold text-sm truncate ${currentResumeId === resume.id ? 'text-black' : 'text-zinc-700'}`}>
                        {resume.name}
                      </h3>
                    )}
                  </div>
                  {currentResumeId === resume.id && !editingId && (
                    <div className="w-1.5 h-1.5 rounded-full bg-black animate-pulse shrink-0 mt-1" />
                  )}
                </div>
                <div className="flex items-center gap-3 mt-1">
                  <span className="text-[10px] text-zinc-400 flex items-center gap-1">
                    <Clock size={10} />
                    {new Date(resume.updated_at).toLocaleDateString()}
                  </span>
                </div>
              </div>

              {/* 操作按钮栏 */}
              <div className="absolute right-2 bottom-2 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setEditingId(resume.id);
                    setEditName(resume.name);
                  }}
                  className="p-1.5 rounded-lg bg-zinc-100 text-zinc-500 hover:bg-zinc-200 hover:text-black transition-all"
                  title="重命名"
                >
                  <Edit3 size={12} />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    wrapAction(onDuplicate, resume.id);
                  }}
                  className="p-1.5 rounded-lg bg-zinc-100 text-zinc-500 hover:bg-zinc-200 hover:text-black transition-all"
                  title="克隆副本"
                >
                  <Copy size={12} />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    wrapAction(onDelete, resume.id);
                  }}
                  className="p-1.5 rounded-lg bg-zinc-100 text-zinc-500 hover:bg-red-50 hover:text-red-500 transition-all"
                  title="删除简历"
                >
                  <Trash2 size={12} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ResumeLibrary;
