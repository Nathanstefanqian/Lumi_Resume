import React from 'react';
import { Phone, Mail, Github, MapPin } from 'lucide-react';
import EditableContent from './EditableContent';
import Section from './Section';

/**
 * 原子组件：用于统一渲染和测量
 */
const ResumeAtom = ({ 
  atom, 
  isMeasurement = false, 
  config, 
  data, 
  labels, 
  handleContentChange, 
  getModuleConfig 
}) => {
  const { type, data: atomData, sectionTitle, itemName, moduleId } = atom;
  const currentConfig = getModuleConfig(moduleId || 'global');
  
  const activeTemplate = config?.activeTemplate || 'classic';
  const templates = config?.templates || {};
  const currentTemplateConfig = templates[activeTemplate] || templates['modern'] || templates['classic'];
  const globalConfig = currentTemplateConfig?.global || { themeColor: '#1a1a1a' };

  if (!data || !currentTemplateConfig) return null;

  const atomProps = isMeasurement ? {
    'data-atom': true,
    'data-atom-type': type,
    'data-section-title': sectionTitle,
    'data-item-name': itemName,
  } : {};

  // 统一处理间距，改用 paddingBottom 确保 getBoundingClientRect().height 包含间距
  let spacing = 0;
  if (atom.isLastInSection) {
    spacing = currentConfig.sectionSpacing;
  } else {
    switch (type) {
      case 'personal_info': spacing = currentConfig.sectionSpacing; break;
      case 'section-header': spacing = 0; break; // 板块标题下方由 Section 内部的 contentSpacing 控制
      case 'self-eval-item': spacing = currentConfig.itemSpacing; break;
      case 'edu-item': spacing = currentConfig.itemSpacing; break;
      case 'edu-bullet': spacing = currentConfig.itemSpacing; break;
      case 'proj-header': spacing = currentConfig.subItemSpacing; break;
      case 'resp-item': spacing = currentConfig.itemSpacing; break;
      case 'intern-header': spacing = currentConfig.subItemSpacing; break;
      case 'intern-proj-header': spacing = currentConfig.subItemSpacing; break;
      case 'intern-detail-item': spacing = currentConfig.itemSpacing; break;
      default: spacing = 0;
    }
  }

  const renderContent = () => {
    const template = activeTemplate;
    switch (type) {
      case 'personal_info':
        if (template === 'classic') {
          return (
            <div 
              style={{ fontSize: `${currentConfig.baseFontSize}pt` }} 
              className="flex justify-between items-start gap-12"
            >
              <div className="flex-1 space-y-6 pt-2">
                <div style={{ marginBottom: `${currentConfig.contentSpacing}px` }} className="space-y-2">
                  <div 
                    className="text-4xl font-black tracking-tight outline-none"
                    style={{ color: '#1a1a1a' }}
                  >
                    <EditableContent 
                      tag="span"
                      initialValue={data.personal_info.name} 
                      onSave={(val) => handleContentChange('personal_info.name', val)} 
                    />
                  </div>
                  <div className="text-sm font-bold text-zinc-700 outline-none flex gap-1 whitespace-nowrap">
                    <span>{labels.targetPosition}：</span>
                    <EditableContent 
                      tag="span"
                      initialValue={data.personal_info.target_position} 
                      onSave={(val) => handleContentChange('personal_info.target_position', val)} 
                    />
                  </div>
                </div>

                <div 
                  className="grid grid-cols-2 gap-x-12"
                  style={{ gap: `${currentConfig.itemSpacing}px`, fontSize: `${currentConfig.baseFontSize * 0.95}pt` }}
                >
                  {Object.entries(data.personal_info).map(([key, value]) => {
                    if (['name', 'target_position', 'photo'].includes(key)) return null;
                    
                    const labelMap = {
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

                    const displayLabel = labels[key] || labelMap[key] || key;

                    return (
                      <div key={key} className="grid grid-cols-[70px_1fr] items-center">
                        <span className="font-bold text-left">{displayLabel}</span>
                        <EditableContent 
                          key={`${key}-${value}`}
                          initialValue={value} 
                          onSave={(val) => handleContentChange(`personal_info.${key}`, val)} 
                        />
                      </div>
                    );
                  })}
                </div>
              </div>
              
              <div className="w-32 h-40 rounded-lg overflow-hidden shrink-0 mt-2">
                <img 
                  src={data.personal_info.photo} 
                  alt="证件照" 
                  className="w-full h-full object-cover" 
                />
              </div>
            </div>
          );
        } else if (template === 'modern') {
          return (
            <div className="flex justify-between items-center w-full gap-12">
              <div className="flex-1 space-y-6">
                <div className="space-y-3">
                  <div 
                    className="text-5xl font-black tracking-tighter"
                    style={{ color: '#1a1a1a' }}
                  >
                    <EditableContent 
                      tag="span"
                      initialValue={data.personal_info.name} 
                      onSave={(val) => handleContentChange('personal_info.name', val)} 
                    />
                  </div>
                  <div className="flex items-center gap-3 whitespace-nowrap">
                    <div className="h-[1px] w-8 bg-zinc-300" />
                    <div className="text-base font-bold text-zinc-600 tracking-widest uppercase">
                      <EditableContent 
                        tag="span"
                        initialValue={data.personal_info.target_position} 
                        onSave={(val) => handleContentChange('personal_info.target_position', val)} 
                      />
                    </div>
                    <div className="h-[1px] w-8 bg-zinc-300" />
                  </div>
                </div>

                <div className="flex flex-wrap gap-x-8 gap-y-3 text-zinc-600 font-medium">
                  {Object.entries(data.personal_info).map(([key, value]) => {
                    if (['name', 'target_position', 'photo'].includes(key)) return null;
                    let Icon = null;
                    if (key === 'phone') Icon = Phone;
                    else if (key === 'email') Icon = Mail;
                    else if (key === 'github') Icon = Github;
                    
                    const labelMap = {
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

                    const displayLabel = labels[key] || labelMap[key] || key;
                    
                    return (
                      <div key={key} className="flex items-center gap-2">
                        {Icon ? (
                          <Icon size={14} style={{ color: globalConfig.themeColor }} />
                        ) : (
                          <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">{displayLabel}:</span>
                        )}
                        <EditableContent 
                          initialValue={value} 
                          onSave={(val) => handleContentChange(`personal_info.${key}`, val)} 
                        />
                      </div>
                    );
                  })}
                </div>
              </div>
              <div className="w-32 h-40 rounded-lg overflow-hidden shrink-0 mt-2">
                <img 
                  src={data.personal_info.photo} 
                  alt="证件照" 
                  className="w-full h-full object-cover" 
                />
              </div>
            </div>
          );
        } else { // minimal
          return (
            <div className="flex justify-between items-start border-b-4 border-black pb-6 mb-2">
              <div className="flex gap-8 items-start">
                <div className="w-24 h-32 bg-zinc-100 shrink-0 overflow-hidden rounded-sm">
                  <img 
                    src={data.personal_info.photo} 
                    alt="证件照" 
                    className="w-full h-full object-cover" 
                  />
                </div>
                <div className="space-y-1">
                  <div className="text-5xl font-black tracking-tight text-black">
                    <EditableContent 
                      tag="span"
                      initialValue={data.personal_info.name} 
                      onSave={(val) => handleContentChange('personal_info.name', val)} 
                    />
                  </div>
                  <div className="text-lg font-bold text-zinc-500 uppercase tracking-widest whitespace-nowrap">
                    <EditableContent 
                      tag="span"
                      initialValue={data.personal_info.target_position} 
                      onSave={(val) => handleContentChange('personal_info.target_position', val)} 
                    />
                  </div>
                  <div className="pt-2 flex flex-wrap gap-x-6 gap-y-1 text-xs font-bold text-zinc-400">
                    {Object.entries(data.personal_info).map(([key, value]) => {
                      if (['name', 'target_position', 'photo', 'phone', 'email', 'github'].includes(key)) return null;
                      
                      const labelMap = {
                        gender: '性别',
                        age: '年龄',
                        region: '现居地',
                        political: '政治面貌',
                        blog: '个人博客',
                        degree: '最高学历',
                        major: '专业名称'
                      };

                      const displayLabel = labels[key] || labelMap[key] || key;

                      return (
                        <div key={key}>
                          {displayLabel}: <EditableContent tag="span" initialValue={value} onSave={(val) => handleContentChange(`personal_info.${key}`, val)} />
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
              <div className="flex flex-col items-end text-sm font-bold text-zinc-800 space-y-0.5">
                {['phone', 'email', 'github'].map(key => (
                  <EditableContent 
                    key={key}
                    initialValue={data.personal_info[key]} 
                    onSave={(val) => handleContentChange(`personal_info.${key}`, val)} 
                  />
                ))}
              </div>
            </div>
          );
        }

      case 'section-header':
        return (
          <div className="w-full">
            <Section title={sectionTitle} moduleId={moduleId} style={{ marginBottom: 0 }} config={config} getModuleConfig={getModuleConfig} />
          </div>
        );

      case 'self-eval-item':
        return (
          <div className="flex gap-3 text-justify leading-relaxed items-start" style={{ fontSize: `${currentConfig.baseFontSize}pt` }}>
            <div 
              className="w-1 h-1 rounded-full shrink-0 mt-[0.65em]" 
              style={{ backgroundColor: globalConfig.themeColor }}
            />
            <EditableContent 
              initialValue={atomData} 
              className="flex-1"
              onSave={(val) => {
                const newEval = [...data.self_evaluation];
                newEval[atom.idx] = val;
                handleContentChange('self_evaluation', newEval);
              }}
            />
          </div>
        );

      case 'edu-item':
        return (
          <div>
            <div className="flex justify-between font-bold" style={{ fontSize: `${currentConfig.titleFontSize}pt`, marginBottom: `${currentConfig.subItemSpacing}px` }}>
              <EditableContent initialValue={atomData.period} className={`${template === 'minimal' ? 'order-3 text-right' : 'w-48'} shrink-0`} onSave={(val) => handleContentChange(`education_background.${atom.idx}.period`, val)} />
              <EditableContent initialValue={atomData.school} className={`${template === 'minimal' ? 'order-1' : 'text-center flex-1'}`} onSave={(val) => handleContentChange(`education_background.${atom.idx}.school`, val)} />
              <EditableContent initialValue={atomData.major} className={`${template === 'minimal' ? 'order-2 px-4' : 'w-48 text-right'} shrink-0`} onSave={(val) => handleContentChange(`education_background.${atom.idx}.major`, val)} />
            </div>
            <div className="flex gap-3 leading-relaxed items-start" style={{ fontSize: `${currentConfig.baseFontSize}pt`, color: '#4b5563' }}>
              <div 
                className={`shrink-0 mt-[0.65em] ${template === 'minimal' ? 'w-1 h-1 bg-black' : 'w-1 h-1 rounded-full'}`} 
                style={{ backgroundColor: template === 'minimal' ? 'black' : globalConfig.themeColor }}
              />
              <div className="flex-1 flex gap-1">
                <span className="font-bold text-zinc-800 shrink-0">{labels.majorCourse}：</span>
                <EditableContent tag="span" initialValue={atomData.skills} className="flex-1" onSave={(val) => handleContentChange(`education_background.${atom.idx}.skills`, val)} />
              </div>
            </div>
            {atomData.exam_results && (
              <div className="flex gap-3 leading-relaxed mt-1 items-start" style={{ fontSize: `${currentConfig.baseFontSize}pt`, color: '#4b5563' }}>
                <div 
                  className={`shrink-0 mt-[0.65em] ${template === 'minimal' ? 'w-1 h-1 bg-black' : 'w-1 h-1 rounded-full'}`} 
                  style={{ backgroundColor: template === 'minimal' ? 'black' : globalConfig.themeColor }}
                />
                <div className="flex-1 flex gap-1">
                  <span className="font-bold text-zinc-800 shrink-0">{labels.examResults}：</span>
                  <EditableContent tag="span" initialValue={atomData.exam_results} className="flex-1" onSave={(val) => handleContentChange(`education_background.${atom.idx}.exam_results`, val)} />
                </div>
              </div>
            )}
          </div>
        );

      case 'edu-bullet':
        return (
          <div className="flex gap-3 text-justify leading-relaxed items-start" style={{ fontSize: `${currentConfig.baseFontSize}pt` }}>
            <div 
              className="w-1 h-1 rounded-full shrink-0 mt-[0.65em]" 
              style={{ backgroundColor: globalConfig.themeColor }}
            />
            <EditableContent 
              initialValue={atomData} 
              className="flex-1"
              onSave={(val) => {
                const newEdu = JSON.parse(JSON.stringify(data.education_background));
                newEdu[atom.idx].bullets[atom.bIdx] = val;
                handleContentChange('education_background', newEdu);
              }}
            />
          </div>
        );

      case 'proj-header':
        return (
          <div className="space-y-2">
            <div className="flex justify-between items-baseline gap-4">
              <EditableContent 
                initialValue={atomData.project_name}
                className={`font-bold tracking-wide flex-1 ${template === 'minimal' ? 'text-black' : 'text-zinc-800'}`} 
                style={{ 
                  fontSize: `${currentConfig.titleFontSize}pt`, 
                  color: template === 'minimal' ? 'black' : globalConfig.themeColor 
                }}
                onSave={(val) => handleContentChange('project_experience.' + atom.idx + '.project_name', val)}
              />
              <div className="flex gap-4 items-baseline shrink-0">
                {atomData.date && (
                  <EditableContent 
                    initialValue={atomData.date}
                    className="text-zinc-500 font-bold"
                    style={{ fontSize: `${currentConfig.baseFontSize * 0.9}pt` }}
                    onSave={(val) => handleContentChange(`project_experience.${atom.idx}.date`, val)}
                  />
                )}
                {atomData.role && (
                  <EditableContent 
                    initialValue={atomData.role}
                    className="text-zinc-500 font-bold"
                    style={{ fontSize: `${currentConfig.baseFontSize * 0.9}pt` }}
                    onSave={(val) => handleContentChange(`project_experience.${atom.idx}.role`, val)}
                  />
                )}
              </div>
            </div>
            <div className="flex justify-between items-baseline">
              {atomData.tech_stack && (
                <div className="flex">
                  <span className="text-zinc-500 font-medium italic" style={{ fontSize: `${currentConfig.baseFontSize * 0.9}pt` }}>(</span>
                  <EditableContent 
                    initialValue={atomData.tech_stack}
                    className="text-zinc-500 font-medium italic"
                    style={{ fontSize: `${currentConfig.baseFontSize * 0.9}pt` }}
                    onSave={(val) => handleContentChange(`project_experience.${atom.idx}.tech_stack`, val)}
                  />
                  <span className="text-zinc-500 font-medium italic" style={{ fontSize: `${currentConfig.baseFontSize * 0.9}pt` }}>)</span>
                </div>
              )}
            </div>
            {atomData.project_background && (
               <EditableContent 
                 initialValue={atomData.project_background}
                 className="text-zinc-800 leading-relaxed text-justify"
                 style={{ fontSize: `${currentConfig.baseFontSize}pt` }}
                 onSave={(val) => handleContentChange(`project_experience.${atom.idx}.project_background`, val)}
               />
             )}
          </div>
        );

      case 'resp-item':
        return (
          <div className="flex gap-3 text-justify leading-relaxed items-start" style={{ fontSize: `${currentConfig.baseFontSize}pt` }}>
            <div 
              className="w-1 h-1 rounded-full shrink-0 mt-[0.65em]" 
              style={{ backgroundColor: globalConfig.themeColor }}
            />
            <EditableContent 
              initialValue={atomData} 
              className="flex-1"
              onSave={(val) => {
                const newProjects = JSON.parse(JSON.stringify(data.project_experience));
                newProjects[atom.idx].responsibilities[atom.rIdx] = val;
                handleContentChange('project_experience', newProjects);
              }}
            />
          </div>
        );

      case 'intern-header':
        return (
          <div 
            className="flex justify-between items-center font-bold" 
            style={{ 
              fontSize: `${currentConfig.titleFontSize}pt`, 
              color: template === 'minimal' ? 'black' : globalConfig.themeColor 
            }}
          >
            <EditableContent initialValue={atomData.period} className={`${template === 'minimal' ? 'order-3 text-right' : 'w-48'} shrink-0`} onSave={(val) => handleContentChange(`internship_experience.${atom.idx}.period`, val)} />
            <EditableContent initialValue={atomData.company} className={`${template === 'minimal' ? 'order-1' : 'text-center flex-1'}`} onSave={(val) => handleContentChange(`internship_experience.${atom.idx}.company`, val)} />
            <EditableContent initialValue={atomData.position} className={`${template === 'minimal' ? 'order-2 px-4' : 'w-48 text-right'} shrink-0`} onSave={(val) => handleContentChange(`internship_experience.${atom.idx}.position`, val)} />
          </div>
        );

      case 'intern-proj-header':
        return (
          <div className="space-y-2">
            <div 
              className="font-bold text-zinc-800 tracking-wide" 
              style={{ 
                fontSize: `${currentConfig.baseFontSize + 0.5}pt`, 
              }}
            >
              <EditableContent 
                initialValue={atomData.name} 
                className={`outline-none w-full ${template === 'minimal' ? 'underline' : ''}`} 
                onSave={(val) => {
                  const newIntern = JSON.parse(JSON.stringify(data.internship_experience));
                  newIntern[atom.idx].projects[atom.pIdx].name = val;
                  handleContentChange('internship_experience', newIntern);
                }} 
              />
            </div>
            {(atomData.project_background || atomData.background) && (
               <EditableContent 
                 initialValue={atomData.project_background || atomData.background}
                 className="text-zinc-800 leading-relaxed text-justify"
                 style={{ fontSize: `${currentConfig.baseFontSize}pt` }}
                 onSave={(val) => {
                   const newIntern = JSON.parse(JSON.stringify(data.internship_experience));
                   if (newIntern[atom.idx].projects[atom.pIdx].project_background !== undefined) {
                     newIntern[atom.idx].projects[atom.pIdx].project_background = val;
                   } else {
                     newIntern[atom.idx].projects[atom.pIdx].background = val;
                   }
                   handleContentChange('internship_experience', newIntern);
                 }}
               />
             )}
          </div>
        );

      case 'intern-detail-item':
        return (
          <div className="flex gap-3 text-justify leading-relaxed items-start" style={{ fontSize: `${currentConfig.baseFontSize}pt` }}>
            <div 
              className="w-1 h-1 rounded-full shrink-0 mt-[0.65em]" 
              style={{ backgroundColor: globalConfig.themeColor }}
            />
            <EditableContent 
              initialValue={atomData} 
              className="flex-1"
              onSave={(val) => {
                const newIntern = JSON.parse(JSON.stringify(data.internship_experience));
                newIntern[atom.idx].projects[atom.pIdx].details[atom.dIdx] = val;
                handleContentChange('internship_experience', newIntern);
              }}
            />
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div 
      {...atomProps} 
      style={{ paddingBottom: `${spacing}px` }}
      className="w-full"
    >
      {renderContent()}
    </div>
  );
};

export default ResumeAtom;
