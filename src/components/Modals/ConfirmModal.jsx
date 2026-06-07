import React, { useState, useEffect, useRef } from 'react';
import { X, AlertCircle, HelpCircle, Info, CheckCircle2 } from 'lucide-react';

const ConfirmModal = ({ 
  show, 
  title, 
  message, 
  type = 'confirm', // 'confirm', 'prompt', 'danger', 'success', 'select'
  defaultValue = '',
  options = [], // [{ label: '文本', value: 'text' }, ...]
  placeholder = '请输入内容...',
  confirmText = '确定',
  cancelText = '取消',
  onConfirm, 
  onCancel 
}) => {
  const [inputValue, setInputValue] = useState('');
  const [selectedValue, setSelectedValue] = useState('');
  const inputRef = useRef(null);

  useEffect(() => {
    if (show) {
      setInputValue(defaultValue || '');
      setSelectedValue(defaultValue || (options[0]?.value) || '');
      if (type === 'prompt') {
        setTimeout(() => inputRef.current?.focus(), 100);
      }
    }
  }, [show, defaultValue, type, options]);

  if (!show) return null;

  const handleConfirm = () => {
    if (type === 'prompt') {
      onConfirm(inputValue);
    } else if (type === 'select') {
      onConfirm(selectedValue);
    } else {
      onConfirm();
    }
  };

  const getIcon = () => {
    switch (type) {
      case 'danger': return <AlertCircle className="text-red-500" size={24} />;
      case 'prompt': return <HelpCircle className="text-blue-500" size={24} />;
      case 'success': return <CheckCircle2 className="text-emerald-500" size={24} />;
      case 'select': return <HelpCircle className="text-purple-500" size={24} />;
      default: return <Info className="text-zinc-500" size={24} />;
    }
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-white w-full max-w-sm rounded-3xl shadow-2xl overflow-hidden relative animate-in zoom-in-95 duration-300">
        <button 
          onClick={onCancel}
          className="absolute top-4 right-4 p-2 text-zinc-400 hover:text-black hover:bg-zinc-100 rounded-full transition-all"
        >
          <X size={18} />
        </button>

        <div className="p-6 pt-8">
          <div className="flex items-center gap-3 mb-4">
            <div className={`p-2 rounded-xl ${type === 'danger' ? 'bg-red-50' : type === 'prompt' ? 'bg-blue-50' : type === 'success' ? 'bg-emerald-50' : 'bg-zinc-50'}`}>
              {getIcon()}
            </div>
            <h3 className="text-lg font-black text-zinc-900">{title}</h3>
          </div>

          <p className="text-zinc-500 text-sm font-medium mb-6 leading-relaxed">
            {message}
          </p>

          {type === 'prompt' && (
            <div className="mb-6">
              <input
                ref={inputRef}
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder={placeholder}
                onKeyDown={(e) => e.key === 'Enter' && handleConfirm()}
                className="w-full px-4 py-3 bg-zinc-50 border border-zinc-100 rounded-2xl outline-none focus:border-black focus:bg-white transition-all font-medium text-sm"
              />
            </div>
          )}

          {type === 'select' && (
            <div className="mb-6 space-y-2">
              {options.map((option) => (
                <button
                  key={option.value}
                  onClick={() => setSelectedValue(option.value)}
                  className={`w-full px-4 py-3 rounded-2xl text-sm font-bold transition-all border-2 flex items-center justify-between ${
                    selectedValue === option.value 
                      ? 'bg-black text-white border-black' 
                      : 'bg-zinc-50 text-zinc-600 border-zinc-50 hover:border-zinc-200'
                  }`}
                >
                  {option.label}
                  {selectedValue === option.value && <CheckCircle2 size={16} />}
                </button>
              ))}
            </div>
          )}

          <div className="flex gap-3">
            {type !== 'success' && (
              <button 
                onClick={onCancel}
                className="flex-1 px-4 py-3 bg-zinc-100 hover:bg-zinc-200 text-zinc-700 rounded-2xl transition-all font-bold text-sm active:scale-95"
              >
                {cancelText}
              </button>
            )}
            <button 
              onClick={handleConfirm}
              className={`flex-1 px-4 py-3 text-white rounded-2xl transition-all font-bold text-sm active:scale-95 shadow-lg ${type === 'danger' ? 'bg-red-500 hover:bg-red-600 shadow-red-100' : type === 'success' ? 'bg-emerald-500 hover:bg-emerald-600 shadow-emerald-100' : 'bg-black hover:bg-zinc-800 shadow-zinc-100'}`}
            >
              {confirmText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
