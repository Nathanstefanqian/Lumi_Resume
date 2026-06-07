import React from 'react';
import { History, X } from 'lucide-react';

const HistoryModal = ({ 
  showHistory, 
  setShowHistory, 
  historyList, 
  handleRestoreHistory 
}) => {
  if (!showHistory) return null;

  return (
    <div className="fixed top-20 right-5 z-[100] w-64 animate-in fade-in slide-in-from-top-4 duration-300">
      <div className="bg-white rounded-xl shadow-2xl border border-zinc-200 overflow-hidden">
        <div className="bg-black text-white px-4 py-3 flex justify-between items-center">
          <h3 className="font-bold text-sm flex items-center gap-2">
            <History size={16} />
            历史版本 (最近10条)
          </h3>
          <button onClick={() => setShowHistory(false)} className="hover:bg-white/20 p-0.5 rounded-full transition-colors">
            <X size={18} />
          </button>
        </div>
        <div className="max-h-80 overflow-y-auto">
          {historyList.length > 0 ? (
            <div className="divide-y divide-zinc-100">
              {historyList.map((h) => (
                <button
                  key={h.id}
                  onClick={() => handleRestoreHistory(h.id)}
                  className="w-full px-4 py-3 text-left hover:bg-zinc-50 transition-colors flex flex-col gap-1 group"
                >
                  <span className="text-xs font-bold text-zinc-900 group-hover:text-black">
                    版本 #{h.id}
                  </span>
                  <span className="text-[10px] text-zinc-500">
                    {new Date(h.created_at).toLocaleString()}
                  </span>
                </button>
              ))}
            </div>
          ) : (
            <div className="px-4 py-8 text-center text-xs text-zinc-400">
              暂无历史记录
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HistoryModal;
