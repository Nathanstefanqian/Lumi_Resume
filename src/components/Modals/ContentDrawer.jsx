import React, { useState, useRef, useEffect } from 'react';
import { X, Plus, Trash2, User, BookOpen, GraduationCap, Briefcase, Layout, ChevronDown, ChevronUp, ChevronLeft, ChevronRight, GripVertical, Image as ImageIcon, Upload, Loader2, Calendar, MapPin, Sparkles, Wand2 } from 'lucide-react';
import request from '../../utils/request';
import { uploadFileDirectly } from '../../utils/oss';

// 基础地区数据
const REGION_DATA = [
  { label: '北京', children: ['北京市'] },
  { label: '上海', children: ['上海市'] },
  { label: '广东', children: ['广州市', '深圳市', '珠海市', '汕头市', '佛山市', '江门市', '湛江市', '茂名市', '肇庆市', '惠州市', '梅州市', '汕尾市', '河源市', '阳江市', '清远市', '东莞市', '中山市', '潮州市', '揭阳市', '云浮市'] },
  { label: '浙江', children: ['杭州市', '宁波市', '温州市', '嘉兴市', '湖州市', '绍兴市', '金华市', '衢州市', '舟山市', '台州市', '丽水市'] },
  { label: '江苏', children: ['南京市', '无锡市', '徐州市', '常州市', '苏州市', '南通市', '连云港市', '淮安市', '盐城市', '扬州市', '镇江市', '泰州市', '宿迁市'] },
  { label: '山东', children: ['济南市', '青岛市', '淄博市', '枣庄市', '东营市', '烟台市', '潍坊市', '济宁市', '泰安市', '威海市', '日照市', '临沂市', '德州市', '聊城市', '滨州市', '菏泽市'] },
  { label: '福建', children: ['福州市', '厦门市', '莆田市', '三明市', '泉州市', '漳州市', '南平市', '龙岩市', '宁德市'] },
  { label: '湖北', children: ['武汉市', '黄石市', '十堰市', '宜昌市', '襄阳市', '鄂州市', '荆门市', '孝感市', '荆州市', '黄冈市', '咸宁市', '随州市', '恩施州'] },
  { label: '湖南', children: ['长沙市', '株洲市', '湘潭市', '衡阳市', '邵阳市', '岳阳市', '常德市', '张家界市', '益阳市', '郴州市', '永州市', '怀化市', '娄底市', '湘西州'] },
  { label: '四川', children: ['成都市', '自贡市', '攀枝花市', '泸州市', '德阳市', '绵阳市', '广元市', '遂宁市', '内江市', '乐山市', '南充市', '眉山市', '宜宾市', '广安市', '达州市', '雅安市', '巴中市', '资阳市', '阿坝州', '甘孜州', '凉山州'] },
  { label: '海外', children: ['美国', '英国', '日本', '加拿大', '澳大利亚', '新加坡', '其他'] }
];

// 简易的 Markdown 转 HTML (仅用于编辑器失焦预览)
const mdToHtml = (text) => {
  if (!text) return '';
  return text
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\n/g, '<br>');
};

const SmartInput = ({ value, onChange, placeholder, isTextArea, themeColor, onDelete }) => {
  const [isEditing, setIsEditing] = useState(false);
  const inputRef = useRef(null);

  const handleKeyDown = (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'b') {
      e.preventDefault();
      const { selectionStart, selectionEnd } = e.target;
      const text = value || '';
      const selectedText = text.substring(selectionStart, selectionEnd);
      
      let newText;
      let newCursorPos;

      if (selectedText.startsWith('**') && selectedText.endsWith('**')) {
        newText = text.substring(0, selectionStart) + selectedText.slice(2, -2) + text.substring(selectionEnd);
        newCursorPos = selectionStart + selectedText.length - 4;
      } else {
        newText = text.substring(0, selectionStart) + `**${selectedText}**` + text.substring(selectionEnd);
        newCursorPos = selectionStart + selectedText.length + 4;
      }

      onChange(newText);
      
      setTimeout(() => {
        e.target.setSelectionRange(selectionStart, newCursorPos);
      }, 0);
    }
  };

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      
      // 将光标定位到文字末尾
      const length = inputRef.current.value.length;
      inputRef.current.setSelectionRange(length, length);

      // 无论是否是 isTextArea，只要是 textarea 标签就调整高度
      if (inputRef.current.tagName === 'TEXTAREA') {
        inputRef.current.style.height = 'auto';
        inputRef.current.style.height = inputRef.current.scrollHeight + 'px';
      }
    }
  }, [isEditing]);

  return (
    <div className="space-y-1.5 flex-1 group/input relative">
      <div className="flex justify-between items-center">
        {placeholder && (
          <div className="flex items-center gap-2">
            <label className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest block">{placeholder}</label>
            {isEditing && <span className="text-[8px] text-zinc-300 font-medium" style={{ color: themeColor }}>源码模式 (Ctrl+B 加粗)</span>}
          </div>
        )}
        {onDelete && (
          <button 
            onClick={onDelete}
            className="opacity-0 group-hover/input:opacity-100 p-1 text-zinc-300 hover:text-red-500 transition-all"
            title="删除此字段"
          >
            <Trash2 size={12} />
          </button>
        )}
      </div>

      {isEditing ? (
        isTextArea ? (
          <textarea
            ref={inputRef}
            value={value || ''}
            onChange={(e) => {
              onChange(e.target.value);
              e.target.style.height = 'auto';
              e.target.style.height = e.target.scrollHeight + 'px';
            }}
            onKeyDown={handleKeyDown}
            onBlur={() => setIsEditing(false)}
            className="w-full border-2 rounded-xl px-4 py-2 text-sm focus:outline-none transition-all min-h-[80px] overflow-hidden resize-none bg-white shadow-sm"
            style={{ borderColor: themeColor }}
          />
        ) : (
          <textarea
            ref={inputRef}
            value={value || ''}
            onChange={(e) => {
              onChange(e.target.value);
              e.target.style.height = 'auto';
              e.target.style.height = e.target.scrollHeight + 'px';
            }}
            onKeyDown={handleKeyDown}
            onBlur={() => setIsEditing(false)}
            rows={1}
            className="w-full border-2 rounded-xl px-4 py-2 text-sm focus:outline-none transition-all overflow-hidden resize-none bg-white shadow-sm min-h-[40px]"
            style={{ borderColor: themeColor }}
          />
        )
      ) : (
        <div
          onClick={() => setIsEditing(true)}
          className="w-full border-2 border-zinc-100 rounded-xl px-4 py-2 text-sm transition-all cursor-text hover:border-zinc-200 bg-zinc-50/30 min-h-[40px] flex items-center"
          style={{ minHeight: isTextArea ? '80px' : '40px', alignItems: isTextArea ? 'flex-start' : 'center' }}
        >
          <div 
            className="prose-sm text-zinc-800 break-words w-full"
            dangerouslySetInnerHTML={{ __html: mdToHtml(value) || `<span class="text-zinc-300">点击编辑 ${placeholder || ''}...</span>` }}
          />
        </div>
      )}
    </div>
  );
};

const ContentDrawer = ({ 
  show, 
  onClose, 
  data, 
  setData, 
  config,
  labels,
  openConfirm,
  showToast
}) => {
  const [activeTab, setActiveTab] = useState('personal_info');
  const [expandedProjects, setExpandedProjects] = useState({});
  const [expandedSections, setExpandedSections] = useState({});
  const [isUploading, setIsUploading] = useState(false);
  const [isAIPolishing, setIsAIPolishing] = useState(false);
  const fileInputRef = useRef(null);
  const themeColor = config.templates?.[config.activeTemplate]?.global?.themeColor || '#1a1a1a';

  if (!show) return null;

  const handlePhotoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('请选择图片文件');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert('图片大小不能超过 5MB');
      return;
    }

    setIsUploading(true);
    try {
      const resData = await uploadFileDirectly(file);
      
      if (resData.success) {
        updateData('personal_info.photo', resData.url);
      }
    } catch {
      alert('图片上传失败');
    } finally {
      setIsUploading(false);
    }
  };

  const toggleProject = (idx) => {
    setExpandedProjects(prev => ({
      ...prev,
      [idx]: !prev[idx]
    }));
  };

  const toggleSection = (projectIdx, sectionKey) => {
    const key = `${projectIdx}-${sectionKey}`;
    setExpandedSections(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const tabs = [
    { id: 'personal_info', label: '基本信息', icon: <User size={18} /> },
    { id: 'self_evaluation', label: '自我评价', icon: <BookOpen size={18} /> },
    { id: 'education_background', label: '教育背景', icon: <GraduationCap size={18} /> },
    { id: 'project_experience', label: '项目经历', icon: <Briefcase size={18} /> },
    { id: 'internship_experience', label: '实习经历', icon: <Layout size={18} /> },
  ];

  const updateData = (path, value) => {
    setData(prev => {
      const newData = JSON.parse(JSON.stringify(prev));
      const keys = path.split('.');
      let current = newData;
      for (let i = 0; i < keys.length - 1; i++) {
        current = current[keys[i]];
      }
      current[keys[keys.length - 1]] = value;
      return newData;
    });
  };

  const renderDateRangePicker = (value, onChange) => {
    // 假设 value 格式为 "YYYY-MM ~ YYYY-MM" 或 "YYYY-MM ~ 至今"
    const [start = '', end = ''] = (value || '').split(' ~ ');

    return (
      <div className="flex items-center gap-2">
        <input
          type="month"
          value={start}
          onChange={(e) => onChange(`${e.target.value} ~ ${end}`)}
          className="flex-1 px-3 py-2 bg-zinc-50 border border-zinc-100 rounded-xl text-sm focus:border-black outline-none transition-all"
        />
        <span className="text-zinc-400">~</span>
        <div className="flex-1 flex gap-1">
          <input
            type="month"
            disabled={end === '至今'}
            value={end === '至今' ? '' : end}
            onChange={(e) => onChange(`${start} ~ ${e.target.value}`)}
            className={`flex-1 px-3 py-2 bg-zinc-50 border border-zinc-100 rounded-xl text-sm focus:border-black outline-none transition-all ${end === '至今' ? 'opacity-50 grayscale' : ''}`}
          />
          <button
            onClick={() => onChange(`${start} ~ ${end === '至今' ? '' : '至今'}`)}
            className={`px-2 py-1 rounded-lg text-[10px] font-black transition-all ${end === '至今' ? 'bg-black text-white' : 'bg-zinc-100 text-zinc-400'}`}
          >
            至今
          </button>
        </div>
      </div>
    );
  };

  const renderDatePicker = (label, value, onChange, onDelete = null) => {
    return (
      <div className="space-y-1.5 flex-1 group/input relative">
        <div className="flex justify-between items-center">
          <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest ml-1">{label}</label>
          {onDelete && (
            <button 
              onClick={onDelete}
              className="opacity-0 group-hover/input:opacity-100 p-1 text-zinc-300 hover:text-red-500 transition-all"
            >
              <Trash2 size={12} />
            </button>
          )}
        </div>
        <div className="relative">
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none">
            <Calendar size={14} />
          </div>
          <input
            type="date"
            value={(/^\d{4}-\d{2}-\d{2}$/.test(value)) ? value : ''}
            onChange={(e) => {
              const date = e.target.value;
              if (!date) return;
              
              const lowerLabel = label.toLowerCase();
              if (lowerLabel.includes('年龄') || lowerLabel.includes('生日') || lowerLabel === 'age' || lowerLabel === 'birthday') {
                const birthDate = new Date(date);
                const today = new Date();
                let age = today.getFullYear() - birthDate.getFullYear();
                const m = today.getMonth() - birthDate.getMonth();
                if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
                  age--;
                }
                onChange(`${age} 岁`);
              } else {
                onChange(date);
              }
            }}
            className="w-full pl-9 pr-4 py-2 bg-zinc-50 border border-zinc-100 rounded-xl text-sm focus:border-black outline-none transition-all"
          />
        </div>
      </div>
    );
  };

  const renderRegionPicker = (label, value, onChange, onDelete = null) => {
    const [province, city] = (value || '').split(' · ');

    return (
      <div className="space-y-1.5 flex-1 group/input relative">
        <div className="flex justify-between items-center">
          <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest ml-1">{label}</label>
          {onDelete && (
            <button 
              onClick={onDelete}
              className="opacity-0 group-hover/input:opacity-100 p-1 text-zinc-300 hover:text-red-500 transition-all"
            >
              <Trash2 size={12} />
            </button>
          )}
        </div>
        <div className="flex gap-2">
          <div className="flex-1 relative">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none">
              <MapPin size={14} />
            </div>
            <select
              value={province || ''}
              onChange={(e) => onChange(`${e.target.value}${city ? ` · ${city}` : ''}`)}
              className="w-full pl-9 pr-4 py-2 bg-zinc-50 border border-zinc-100 rounded-xl text-sm focus:border-black outline-none transition-all appearance-none cursor-pointer"
            >
              <option value="" disabled>省份</option>
              {REGION_DATA.map(p => (
                <option key={p.label} value={p.label}>{p.label}</option>
              ))}
            </select>
          </div>
          <div className="flex-1 relative">
            <select
              value={city || ''}
              disabled={!province}
              onChange={(e) => onChange(`${province} · ${e.target.value}`)}
              className="w-full px-4 py-2 bg-zinc-50 border border-zinc-100 rounded-xl text-sm focus:border-black outline-none transition-all appearance-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <option value="" disabled>城市</option>
              {REGION_DATA.find(p => p.label === province)?.children.map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none">
              <ChevronDown size={14} />
            </div>
          </div>
        </div>
      </div>
    );
  };

  const deleteData = (path) => {
    setData(prev => {
      const newData = JSON.parse(JSON.stringify(prev));
      const keys = path.split('.');
      let current = newData;
      for (let i = 0; i < keys.length - 1; i++) {
        current = current[keys[i]];
      }
      delete current[keys[keys.length - 1]];
      return newData;
    });
  };

  const renderInput = (label, value, onChange, type = "text", onDelete = null) => {
    // 自动匹配类型
    let detectedType = type;
    const lowerLabel = (label || '').toLowerCase();
    
    if (detectedType === 'text') {
      if (lowerLabel.includes('年龄') || lowerLabel.includes('生日') || lowerLabel === 'age' || lowerLabel === 'birthday') {
        detectedType = 'date';
      } else if (lowerLabel.includes('地区') || lowerLabel.includes('居地') || lowerLabel.includes('城市') || lowerLabel === 'region') {
        detectedType = 'region';
      }
    }

    if (detectedType === 'date') {
      return renderDatePicker(label, value, onChange, onDelete);
    }

    if (detectedType === 'region') {
      return renderRegionPicker(label, value, onChange, onDelete);
    }

    return (
      <SmartInput 
        value={value} 
        onChange={onChange} 
        placeholder={label} 
        isTextArea={detectedType === "textarea"} 
        themeColor={themeColor} 
        onDelete={onDelete}
      />
    );
  };

  const renderBulletList = (list, path) => {
    const safeList = Array.isArray(list) ? list : (typeof list === 'string' ? [list] : []);
    return (
      <div className="space-y-3 pl-4 border-l-2 border-zinc-50">
        {safeList.map((item, idx) => (
          <div key={idx} className="flex gap-2 items-start group/bullet">
            <SmartInput
              value={item}
              onChange={(val) => {
                const newList = [...safeList];
                newList[idx] = val;
                updateData(path, newList);
              }}
              onDelete={() => {
                const newList = safeList.filter((_, i) => i !== idx);
                updateData(path, newList);
              }}
            />
          </div>
        ))}
        <button 
          onClick={() => updateData(path, [...safeList, ''])}
          className="text-xs font-bold text-zinc-400 hover:text-zinc-600 flex items-center gap-1 mt-2 transition-all"
        >
          <Plus size={14} /> 添加要点
        </button>
      </div>
    );
  };

  return (
    <div 
      className={`fixed md:relative inset-y-0 z-[45] bg-white border-r border-zinc-200 shadow-2xl transition-all duration-300 ease-in-out flex flex-col 
        ${show ? 'translate-x-0 opacity-100' : '-translate-x-full md:translate-x-0 opacity-0 pointer-events-none md:w-0'}
        w-full md:w-full h-full
      `}
    >
      {/* 收起按钮 (挂在右边缘, 仅PC端) */}
      <button 
        onClick={onClose}
        className="absolute top-1/2 -right-4 -translate-y-1/2 bg-white border border-zinc-200 shadow-lg rounded-full p-1.5 z-[50] text-zinc-400 hover:text-black transition-all active:scale-95 hidden md:flex items-center justify-center group"
        title="收起编辑中心"
      >
        <ChevronLeft size={20} className="group-hover:-translate-x-0.5 transition-transform" />
      </button>

      <div className="flex-1 flex flex-col h-full overflow-hidden w-full">
        {/* 头部：更紧凑的设计 */}
        <div className="px-4 md:px-6 py-3 md:py-4 flex justify-between items-center shrink-0 border-b border-zinc-100">
          <div className="flex items-center gap-3">
            <div className="w-1 md:w-1.5 h-5 md:h-6 rounded-full" style={{ backgroundColor: themeColor }} />
            <h3 className="font-bold text-base md:text-lg text-zinc-800">内容编辑中心</h3>
          </div>
          <button 
            onClick={onClose} 
            className="bg-zinc-100 hover:bg-zinc-200 text-zinc-500 p-2 rounded-full transition-all active:scale-90"
          >
            <X size={20} />
          </button>
        </div>

        {/* 标签栏 */}
        <div className="flex border-b border-zinc-100 bg-zinc-50/30 p-1 shrink-0 overflow-x-auto no-scrollbar">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-3 text-sm font-bold rounded-lg transition-all whitespace-nowrap ${
                activeTab === tab.id 
                  ? 'bg-white shadow-sm text-black border border-zinc-200' 
                  : 'text-zinc-400 hover:text-zinc-600'
              }`}
            >
              {React.cloneElement(tab.icon, { size: 18 })}
              {tab.label}
            </button>
          ))}
        </div>

        {/* 编辑区域 */}
        <div className="flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar">
            {/* 基本信息 */}
            {activeTab === 'personal_info' && (
              <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
                {/* 照片上传区域 */}
                <div className="flex flex-col items-center gap-4 pb-6 border-b border-zinc-100">
                  <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest self-start">个人照片</label>
                  <div className="relative group/photo">
                    <div className="w-24 h-32 rounded-xl overflow-hidden border-2 border-zinc-100 bg-zinc-50 flex items-center justify-center transition-all group-hover/photo:border-zinc-300">
                      {data.personal_info.photo ? (
                        <img 
                          src={data.personal_info.photo} 
                          alt="照片预览" 
                          className="w-full h-full object-cover" 
                        />
                      ) : (
                        <ImageIcon size={32} className="text-zinc-200" />
                      )}
                      
                      {isUploading && (
                        <div className="absolute inset-0 bg-white/80 flex items-center justify-center backdrop-blur-sm">
                          <Loader2 size={24} className="animate-spin" style={{ color: themeColor }} />
                        </div>
                      )}
                    </div>
                    
                    <button 
                      onClick={() => fileInputRef.current?.click()}
                      disabled={isUploading}
                      className="absolute -bottom-2 -right-2 p-2 bg-white border border-zinc-200 rounded-full shadow-md text-zinc-500 hover:text-black hover:border-zinc-300 transition-all active:scale-90"
                      title="上传新照片"
                    >
                      <Upload size={14} />
                    </button>
                    
                    <input 
                      type="file" 
                      ref={fileInputRef}
                      className="hidden" 
                      accept="image/*"
                      onChange={handlePhotoUpload}
                    />
                  </div>
                  <p className="text-[10px] text-zinc-400">支持 JPG/PNG，大小不超过 5MB</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {Object.entries(data.personal_info).map(([key, value]) => {
                    if (key === 'photo') return null;
                    const isFixedField = ['name', 'target_position', 'phone', 'email', 'github'].includes(key);
                    
                    // 统一字段标签映射
                    const labelMap = {
                      name: '姓名',
                      target_position: '意向岗位',
                      phone: '电话',
                      email: '邮箱',
                      github: 'GitHub',
                      gender: '性别',
                      age: '年龄',
                      region: '现居地',
                      political: '政治面貌',
                      blog: '个人博客',
                      degree: '最高学历',
                      major: '专业名称'
                    };

                    const label = labels[key] || labelMap[key] || key;

                    return (
                      <div key={key}>
                        {renderInput(
                          label, 
                          value, 
                          (val) => updateData(`personal_info.${key}`, val),
                          "text",
                          !isFixedField ? () => deleteData(`personal_info.${key}`) : null
                        )}
                      </div>
                    );
                  })}
                </div>
                <div className="space-y-3 pt-4 border-t border-zinc-100">
                  <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest block ml-1">推荐添加</label>
                  <div className="flex flex-wrap gap-2">
                    {[
                      { key: 'gender', label: '性别', icon: <User size={12} /> },
                      { key: 'age', label: '年龄/生日', icon: <Calendar size={12} /> },
                      { key: 'region', label: '现居地', icon: <MapPin size={12} /> },
                      { key: 'political', label: '政治面貌', icon: <Sparkles size={12} /> },
                      { key: 'blog', label: '个人博客', icon: <Layout size={12} /> },
                    ].map(field => (
                      !data.personal_info[field.key] && (
                        <button
                          key={field.key}
                          onClick={() => updateData(`personal_info.${field.key}`, field.key === 'age' ? '24 岁' : '未填写')}
                          className="px-3 py-1.5 bg-zinc-50 hover:bg-zinc-100 border border-zinc-100 rounded-lg text-xs font-bold text-zinc-600 transition-all flex items-center gap-1.5 active:scale-95"
                        >
                          {field.icon} {field.label}
                        </button>
                      )
                    ))}
                    <button 
                      onClick={() => {
                        openConfirm({
                          title: '添加自定义字段',
                          message: '请输入新字段的名称（如：微信号、期望薪资等）',
                          type: 'prompt',
                          onConfirm: (fieldName) => {
                            if (fieldName) {
                              // 第一步成功后，紧接着进行第二步：选择类型
                              setTimeout(() => {
                                openConfirm({
                                  title: '选择字段类型',
                                  message: `请选择 "${fieldName}" 的输入类型`,
                                  type: 'select',
                                  options: [
                                    { label: '普通文本', value: 'text' },
                                    { label: '日期选择 (自动计算年龄)', value: 'date' },
                                    { label: '地区选择 (省市联动)', value: 'region' }
                                  ],
                                  onConfirm: (fieldType) => {
                                    // 预设一些默认值
                                    let defaultValue = '未填写';
                                    if (fieldType === 'date') defaultValue = '2000-01-01';
                                    if (fieldType === 'region') defaultValue = '北京 · 北京市';
                                    
                                    // 如果字段名包含年龄，强制使用 date 逻辑，即使选择了 text
                                    // 或者我们信任 renderInput 的自动检测
                                    updateData(`personal_info.${fieldName}`, defaultValue);
                                  }
                                });
                              }, 300); // 稍微延迟以确保上一个模态框完全关闭
                            }
                          }
                        });
                      }}
                      className="px-3 py-1.5 border border-dashed border-zinc-200 rounded-lg text-xs font-bold text-zinc-400 hover:border-zinc-300 hover:text-zinc-600 transition-all flex items-center gap-1.5 active:scale-95"
                    >
                      <Plus size={12} /> 自定义
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* 自我评价 */}
            {activeTab === 'self_evaluation' && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                <div className="bg-zinc-50/50 border border-zinc-100 rounded-2xl p-4 md:p-6 space-y-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Sparkles size={16} className="text-amber-500" />
                      <span className="text-sm font-bold text-zinc-700">自我评价列表</span>
                    </div>
                    <button 
                      onClick={async () => {
                        const currentText = data.self_evaluation.filter(i => i && i.trim()).join('\n');
                        if (!currentText) {
                          showToast('请先输入一些自我评价内容再进行润色', 'error');
                          return;
                        }
                        
                        setIsAIPolishing(true);
                        try {
                          const res = await request.post('/api/ai/polish-self-evaluation', { text: currentText });
                          if (res) {
                            const polishedItems = Array.isArray(res) 
                              ? res 
                              : res.toString().split('\n').filter(i => i.trim());
                            updateData('self_evaluation', polishedItems);
                            showToast('AI 润色成功', 'success');
                          }
                        } catch {
                          alert('AI 润色失败，请检查后端 API 是否可用');
                        } finally {
                          setIsAIPolishing(false);
                        }
                      }}
                      disabled={isAIPolishing}
                      className="flex items-center gap-2 px-3 py-1.5 bg-black text-white rounded-lg text-xs font-bold hover:bg-zinc-800 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isAIPolishing ? <Loader2 size={14} className="animate-spin" /> : <Wand2 size={14} />}
                      AI 润色
                    </button>
                  </div>
                  {renderBulletList(data.self_evaluation, 'self_evaluation')}
                </div>
                
                <div className="p-4 bg-amber-50 border border-amber-100 rounded-xl flex gap-3">
                  <Sparkles size={18} className="text-amber-500 shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <p className="text-xs font-bold text-amber-900">AI 提示</p>
                    <p className="text-[10px] text-amber-700 leading-relaxed">
                      模糊的输入也可以！告诉 AI 你的工作内容和特点，它会帮你转化成类似“具备 X 年开发经验，精通 Y 技术栈”的专业描述。
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* 教育背景 */}
            {activeTab === 'education_background' && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                {data.education_background.map((edu, idx) => (
                  <div key={idx} className="relative p-5 bg-zinc-50/50 rounded-2xl border border-zinc-100 space-y-4">
                    <div className="flex justify-between items-start border-b border-zinc-200 pb-4">
                      <div className="flex-1 space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          {renderInput('学校名称', edu.school, (val) => {
                            const newList = [...data.education_background];
                            newList[idx].school = val;
                            updateData('education_background', newList);
                          })}
                          {renderInput('专业名称', edu.major, (val) => {
                            const newList = [...data.education_background];
                            newList[idx].major = val;
                            updateData('education_background', newList);
                          })}
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest ml-1">在校时间</label>
                          {renderDateRangePicker(edu.period || edu.date, (val) => {
                            const newList = [...data.education_background];
                            newList[idx].period = val;
                            // 如果存在旧的 date 字段，删除它以保持数据整洁
                            if (newList[idx].date) delete newList[idx].date;
                            updateData('education_background', newList);
                          })}
                        </div>
                      </div>
                      <button 
                        onClick={() => {
                          const newList = data.education_background.filter((_, i) => i !== idx);
                          updateData('education_background', newList);
                        }}
                        className="ml-4 p-2 text-zinc-300 hover:text-red-500 transition-all"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest block">主修课程</label>
                        {renderInput(null, edu.courses || edu.skills, (val) => {
                          const newList = [...data.education_background];
                          if (newList[idx].skills !== undefined) {
                            newList[idx].skills = val;
                          } else {
                            newList[idx].courses = val;
                          }
                          updateData('education_background', newList);
                        })}
                      </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest block">补充要点</label>
                      {renderBulletList(edu.bullets || [], `education_background.${idx}.bullets`)}
                    </div>
                  </div>
                ))}
                <button 
                  onClick={() => updateData('education_background', [...data.education_background, { school: '', degree: '', major: '', period: '', courses: '', bullets: [] }])}
                  className="w-full py-4 border-2 border-dashed border-zinc-200 rounded-2xl text-zinc-400 text-sm font-bold hover:border-zinc-300 hover:text-zinc-500 transition-all flex items-center justify-center gap-2"
                >
                  <Plus size={20} /> 添加教育背景
                </button>
              </div>
            )}

            {/* 项目经历 */}
            {activeTab === 'project_experience' && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                {data.project_experience.map((proj, idx) => {
                  const isExpanded = expandedProjects[idx] !== false; // 默认展开
                  return (
                    <div key={idx} className="relative bg-zinc-50/50 rounded-2xl border border-zinc-100 overflow-hidden transition-all duration-300">
                      {/* 项目卡片头部 - 点击切换展开 */}
                      <div 
                        onClick={() => toggleProject(idx)}
                        className="p-4 flex justify-between items-center cursor-pointer hover:bg-zinc-100/50 transition-colors border-b border-zinc-100"
                      >
                        <div className="flex items-center gap-3">
                          <div className={`p-1 rounded-md transition-all ${isExpanded ? 'rotate-180' : ''}`} style={{ color: themeColor }}>
                            <ChevronDown size={16} />
                          </div>
                          <span className="font-bold text-sm text-zinc-700 truncate max-w-[200px]">
                            {proj.name || proj.project_name || `项目 ${idx + 1}`}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              const newList = data.project_experience.filter((_, i) => i !== idx);
                              updateData('project_experience', newList);
                            }}
                            className="p-2 text-zinc-300 hover:text-red-500 transition-all"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>

                      {/* 项目详细编辑区 */}
                      <div className={`transition-all duration-300 ease-in-out ${isExpanded ? 'max-h-[2000px] opacity-100 p-5 pt-4' : 'max-h-0 opacity-0 overflow-hidden p-0'}`}>
                        <div className="space-y-4">
                          <div className="grid grid-cols-1 gap-4">
                            {renderInput('项目名称', proj.name || proj.project_name, (val) => {
                              const newList = [...data.project_experience];
                              if (newList[idx].project_name !== undefined) {
                                newList[idx].project_name = val;
                              } else {
                                newList[idx].name = val;
                              }
                              updateData('project_experience', newList);
                            })}
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            {renderInput('项目时间', proj.date || '', (val) => {
                              const newList = [...data.project_experience];
                              newList[idx].date = val;
                              updateData('project_experience', newList);
                            })}
                            {renderInput('项目角色', proj.role || '', (val) => {
                              const newList = [...data.project_experience];
                              newList[idx].role = val;
                              updateData('project_experience', newList);
                            })}
                          </div>
                          <div className="space-y-2">
                            <div 
                              className="flex items-center gap-2 cursor-pointer group/label"
                              onClick={() => toggleSection(idx, 'background')}
                            >
                              <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest block cursor-pointer group-hover/label:text-zinc-600 transition-colors">项目背景</label>
                              <div className={`text-zinc-300 transition-transform duration-200 ${expandedSections[`${idx}-background`] ? 'rotate-180' : ''}`}>
                                <ChevronDown size={12} />
                              </div>
                            </div>
                            <div className={`transition-all duration-300 overflow-hidden ${expandedSections[`${idx}-background`] ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'}`}>
                              {renderInput(null, proj.background || proj.project_background, (val) => {
                                const newList = [...data.project_experience];
                                if (newList[idx].project_background !== undefined) {
                                  newList[idx].project_background = val;
                                } else {
                                  newList[idx].background = val;
                                }
                                updateData('project_experience', newList);
                              }, "textarea")}
                            </div>
                          </div>
                          <div className="space-y-2">
                            <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest block">技术点介绍</label>
                            {renderBulletList(proj.bullets || proj.responsibilities, `project_experience.${idx}.${proj.responsibilities ? 'responsibilities' : 'bullets'}`)}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
                <button 
                  onClick={() => updateData('project_experience', [...data.project_experience, { 
                    project_name: '', 
                    date: '', 
                    role: '',
                    project_background: '', 
                    responsibilities: [''] 
                  }])}
                  className="w-full py-4 border-2 border-dashed border-zinc-200 rounded-2xl text-zinc-400 text-sm font-bold hover:border-zinc-300 hover:text-zinc-500 transition-all flex items-center justify-center gap-2"
                >
                  <Plus size={20} /> 添加项目经历
                </button>
              </div>
            )}

            {/* 实习经历 (三级嵌套) */}
            {activeTab === 'internship_experience' && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                {data.internship_experience.map((intern, idx) => (
                  <div key={idx} className="relative p-5 bg-zinc-50/50 rounded-2xl border border-zinc-100 space-y-4">
                    <div className="flex justify-between items-center border-b border-zinc-200 pb-4">
                      <div className="flex-1 grid grid-cols-1 gap-4">
                        <div className="grid grid-cols-2 gap-4">
                          {renderInput('公司名称', intern.company, (val) => {
                            const newList = [...data.internship_experience];
                            newList[idx].company = val;
                            updateData('internship_experience', newList);
                          })}
                          {renderInput('职位名称', intern.position || '', (val) => {
                            const newList = [...data.internship_experience];
                            newList[idx].position = val;
                            updateData('internship_experience', newList);
                          })}
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest ml-1">实习时间</label>
                          {renderDateRangePicker(intern.period || intern.date, (val) => {
                            const newList = [...data.internship_experience];
                            newList[idx].period = val;
                            if (newList[idx].date) delete newList[idx].date;
                            updateData('internship_experience', newList);
                          })}
                        </div>
                      </div>
                      <button 
                        onClick={() => {
                          const newList = data.internship_experience.filter((_, i) => i !== idx);
                          updateData('internship_experience', newList);
                        }}
                        className="ml-4 p-2 text-zinc-300 hover:text-red-500 transition-all self-start"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>

                    {/* 实习下的项目 */}
                    <div className="space-y-6">
                      <label className="text-xs font-bold text-black uppercase tracking-widest flex items-center gap-2">
                        <Briefcase size={14} /> 实习项目
                      </label>
                      <div className="space-y-4 pl-4 border-l-2 border-zinc-200">
                        {intern.projects.map((proj, pIdx) => (
                          <div key={pIdx} className="relative p-4 bg-white rounded-xl border border-zinc-100 shadow-sm space-y-4">
                            <button 
                              onClick={() => {
                                const newList = [...data.internship_experience];
                                newList[idx].projects = intern.projects.filter((_, i) => i !== pIdx);
                                updateData('internship_experience', newList);
                              }}
                              className="absolute top-2 right-2 p-1.5 text-zinc-300 hover:text-red-500 transition-all"
                            >
                              <Trash2 size={14} />
                            </button>
                            {renderInput('项目名称', proj.name, (val) => {
                              const newList = [...data.internship_experience];
                              newList[idx].projects[pIdx].name = val;
                              updateData('internship_experience', newList);
                            })}
                            <div className="space-y-2">
                              <div 
                                className="flex items-center gap-2 cursor-pointer group/label"
                                onClick={() => toggleSection(`${idx}-${pIdx}`, 'intern-background')}
                              >
                                <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest block cursor-pointer group-hover/label:text-zinc-600 transition-colors">项目背景</label>
                                <div className={`text-zinc-300 transition-transform duration-200 ${expandedSections[`${idx}-${pIdx}-intern-background`] ? 'rotate-180' : ''}`}>
                                  <ChevronDown size={12} />
                                </div>
                              </div>
                              <div className={`transition-all duration-300 overflow-hidden ${expandedSections[`${idx}-${pIdx}-intern-background`] ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'}`}>
                                {renderInput(null, proj.background || proj.project_background, (val) => {
                                  const newList = [...data.internship_experience];
                                  if (newList[idx].projects[pIdx].project_background !== undefined) {
                                    newList[idx].projects[pIdx].project_background = val;
                                  } else {
                                    newList[idx].projects[pIdx].background = val;
                                  }
                                  updateData('internship_experience', newList);
                                }, "textarea")}
                              </div>
                            </div>
                            <div className="space-y-2">
                              <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest block">技术要点</label>
                              {renderBulletList(proj.bullets || proj.details, `internship_experience.${idx}.projects.${pIdx}.${proj.details ? 'details' : 'bullets'}`)}
                            </div>
                          </div>
                        ))}
                        <button 
                          onClick={() => {
                            const newList = [...data.internship_experience];
                            newList[idx].projects.push({ 
                              name: '', 
                              project_background: '', 
                              details: [''] 
                            });
                            updateData('internship_experience', newList);
                          }}
                          className="text-sm font-bold text-zinc-500 hover:text-black flex items-center gap-1 transition-all"
                        >
                          <Plus size={16} /> 新增实习项目
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
                <button 
                  onClick={() => updateData('internship_experience', [...data.internship_experience, { company: '', period: '', projects: [] }])}
                  className="w-full py-4 border-2 border-dashed border-zinc-200 rounded-2xl text-zinc-400 text-sm font-bold hover:border-zinc-300 hover:text-zinc-500 transition-all flex items-center justify-center gap-2"
                >
                  <Plus size={20} /> 添加实习公司
                </button>
              </div>
            )}
          </div>

          <div className="p-4 border-t border-zinc-100 shrink-0 bg-zinc-50/30">
            <button 
              onClick={onClose}
              className="w-full py-3 bg-black text-white rounded-xl font-bold shadow-lg active:scale-[0.98] transition-all flex items-center justify-center gap-2"
            >
              完成并关闭
            </button>
          </div>
        </div>
      </div>
  );
};

export default ContentDrawer;
