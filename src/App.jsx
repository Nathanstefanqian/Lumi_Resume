import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import { Download, Save, Settings, History, Palette, Image, RotateCcw, Layout, Copy, Sparkles, Plus, LogIn, Minus } from 'lucide-react';
import { toPng } from 'html-to-image';
import request from './utils/request';

// 数据与常量
import { resumeData } from './data/resume-data';

// 组件
import Page from './components/Page';
import ResumeAtom from './components/ResumeAtom';
import Sidebar from './components/Sidebar';
import SettingsModal from './components/Modals/SettingsModal';
import ColorPickerModal from './components/Modals/ColorPickerModal';
import HistoryModal from './components/Modals/HistoryModal';
import ContentDrawer from './components/Modals/ContentDrawer';
import LoginPage from './components/LoginPage';
import ConfirmModal from './components/Modals/ConfirmModal';
import Toast from './components/Toast';

// Hooks
import { usePagination } from './hooks/usePagination';

const ResumeEditor = () => {
  const resumeRef = useRef(null);
  const measureRef = useRef(null);
  
  const [lang, setLang] = useState('zh');
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('lumi_user') || 'null'));

  // 获取初始空白数据
  const getEmptyResumeData = useCallback((targetLang) => {
    const labels = resumeData[targetLang]?.labels || resumeData['zh'].labels;
    return {
      labels,
      personal_info: {
        name: "您的姓名",
        target_position: "目标岗位",
        age: "24 岁",
        gender: "男/女",
        phone: "13800138000",
        email: "yourname@example.com",
        github: "github.com/yourname",
        photo: "https://api.dicebear.com/7.x/avataaars/png?seed=Milo&backgroundColor=b6e3f4"
      },
      self_evaluation: ["请在此输入您的自我评价，突出您的核心竞争力和优势..."],
      education_background: [
        {
          period: "2020-09 ~ 2024-06",
          school: "您的大学名称",
          major: "您的专业名称",
          skills: "主修课程或专业技能描述",
          bullets: ["在校期间获得过哪些奖项或荣誉...", "参与过哪些社团活动或社会实践..."]
        }
      ],
      internship_experience: [
        {
          company: "实习公司名称",
          position: "实习岗位",
          period: "2023-07 ~ 2023-09",
          projects: [
            {
              name: "实习项目名称",
              background: "请描述实习期间的项目背景和目标...",
              details: ["您在项目中负责的具体工作...", "取得的成果或量化指标..."]
            }
          ]
        }
      ],
      project_experience: [
        {
          project_name: "您的项目名称",
          date: "2023-01 ~ 2023-06",
          role: "您的角色",
          project_background: "请描述项目背景和核心功能...",
          responsibilities: ["您在项目中的核心贡献...", "解决的技术难点或优化的性能..."]
        }
      ]
    };
  }, []);

  // 初始数据逻辑：默认显示空白模板，登录后在 useEffect 中加载用户数据
  const [data, setData] = useState(getEmptyResumeData(lang));
  const [currentResumeId, setCurrentResumeId] = useState(localStorage.getItem('current_resume_id') || null);
  const [isLoadingResume, setIsLoadingResume] = useState(false);
  const [lastSavedData, setLastSavedData] = useState(null);
  const [lastSavedConfig, setLastSavedConfig] = useState(null);
  const [historyList, setHistoryList] = useState([]);
  const [resumesList, setResumesList] = useState([]); // 新增简历列表状态
  
  const [showHistory, setShowHistory] = useState(false);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showContentDrawer, setShowContentDrawer] = useState(false);
  const [showSidebar, setShowSidebar] = useState(true);
  const [activeModule, setActiveModule] = useState('global');
  const [isSaving, setIsSaving] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [zoom, setZoom] = useState(0.8); // 移动端初始缩放
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

  // 通用确认框状态
  const [confirmModal, setConfirmModal] = useState({
    show: false,
    title: '',
    message: '',
    type: 'confirm',
    defaultValue: '',
    onConfirm: () => {},
    onCancel: () => setConfirmModal(prev => ({ ...prev, show: false }))
  });

  const openConfirm = useCallback((config) => {
    setConfirmModal({
      show: true,
      title: config.title || '确认操作',
      message: config.message || '',
      type: config.type || 'confirm',
      defaultValue: config.defaultValue || '',
      onConfirm: (val) => {
        config.onConfirm(val);
        setConfirmModal(prev => ({ ...prev, show: false }));
      },
      onCancel: () => {
        if (config.onCancel) config.onCancel();
        setConfirmModal(prev => ({ ...prev, show: false }));
      }
    });
  }, []);

  const showToast = useCallback((message, type = 'success') => {
    setToast({ show: true, message, type });
  }, []);

  // 根据屏幕尺寸初始化缩放
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) {
        setZoom(0.5);
      } else if (window.innerWidth < 768) {
        setZoom(0.65);
      } else if (window.innerWidth < 1024) {
        setZoom(0.8);
      } else {
        setZoom(1.0);
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // 登录相关处理
  const onLoginSuccess = useCallback((token, userData) => {
    localStorage.setItem('lumi_token', token);
    localStorage.setItem('lumi_user', JSON.stringify(userData));
    setUser(userData);
  }, []);

  const performLogout = useCallback((silent = false) => {
    localStorage.removeItem('lumi_token');
    localStorage.removeItem('lumi_user');
    localStorage.removeItem('current_resume_id');
    setUser(null);
    setCurrentResumeId(null);
    setData(getEmptyResumeData(lang));
    if (!silent) {
      alert('您的登录已过期，请重新登录');
    }
  }, [lang, getEmptyResumeData]);

  const onLogout = useCallback(() => {
    openConfirm({
      title: '退出登录',
      message: '确定要退出登录吗？退出后将无法同步数据。',
      onConfirm: () => performLogout(true)
    });
  }, [performLogout, openConfirm]);

  const migrateV3 = useCallback((old) => {
    const createInitialState = () => ({
      global: {
        sectionSpacing: 40,
        contentSpacing: 12,
        itemSpacing: 8,
        subItemSpacing: 4,
        baseFontSize: 9.5,
        titleFontSize: 11,
        themeColor: '#1a1a1a',
      },
      personal_info: { sectionSpacing: 14 },
      self_evaluation: { sectionSpacing: 17 },
      education_background: { sectionSpacing: 25 },
      project_experience: { sectionSpacing: 31 },
      internship_experience: { sectionSpacing: 38 },
    });

    const activeTpl = old.global?.template || 'classic';
    const validOld = (old.global && old.personal_info) ? old : createInitialState();
    return {
      activeTemplate: activeTpl,
      templates: {
        classic: activeTpl === 'classic' ? validOld : createInitialState(),
        modern: activeTpl === 'modern' ? validOld : createInitialState(),
        minimal: activeTpl === 'minimal' ? validOld : createInitialState(),
      }
    };
  }, []);

  // 统一的面板切换逻辑
  const togglePanel = useCallback((panel) => {
    const panels = {
      settings: setShowSettings,
      content: setShowContentDrawer,
      color: setShowColorPicker,
      history: setShowHistory
    };

    // 关闭其他所有面板
    Object.keys(panels).forEach(key => {
      if (key === panel) {
        panels[key](prev => !prev);
      } else {
        panels[key](false);
      }
    });
  }, []);

  // 1. 统一的模块化配置状态初始化与持久化
  const [config, setConfig] = useState({
    activeTemplate: 'modern',
    templates: {
      classic: { global: { sectionSpacing: 40, contentSpacing: 12, itemSpacing: 8, subItemSpacing: 4, baseFontSize: 9.5, titleFontSize: 11, themeColor: '#1a1a1a' }, personal_info: { sectionSpacing: 14 }, self_evaluation: { sectionSpacing: 17 }, education_background: { sectionSpacing: 25 }, project_experience: { sectionSpacing: 31 }, internship_experience: { sectionSpacing: 38 } },
      modern: { global: { sectionSpacing: 40, contentSpacing: 12, itemSpacing: 8, subItemSpacing: 4, baseFontSize: 9.5, titleFontSize: 11, themeColor: '#1a1a1a' }, personal_info: { sectionSpacing: 14 }, self_evaluation: { sectionSpacing: 17 }, education_background: { sectionSpacing: 25 }, project_experience: { sectionSpacing: 31 }, internship_experience: { sectionSpacing: 38 } },
      minimal: { global: { sectionSpacing: 40, contentSpacing: 12, itemSpacing: 8, subItemSpacing: 4, baseFontSize: 9.5, titleFontSize: 11, themeColor: '#1a1a1a' }, personal_info: { sectionSpacing: 14 }, self_evaluation: { sectionSpacing: 17 }, education_background: { sectionSpacing: 25 }, project_experience: { sectionSpacing: 31 }, internship_experience: { sectionSpacing: 38 } },
    }
  });

  // 2. 数据获取逻辑
  const fetchResumeDetail = useCallback(async (id) => {
    if (!id) return;
    setIsLoadingResume(true);
    try {
      const resData = await request.get(`/api/resumes/${id}`);
      if (resData) {
        let { data: resDataContent, config: resConfig } = resData;
        
        // 确保配置包含所有模板设置
        if (!resConfig.templates) {
          resConfig = migrateV3(resConfig);
        }
        
        setData(resDataContent);
        setConfig(resConfig);
        setLastSavedData(resDataContent);
        setLastSavedConfig(resConfig);
        setCurrentResumeId(id);
        localStorage.setItem('current_resume_id', id);
      }
    } catch (err) {
      if (err.response?.status === 404) {
        // 如果简历不存在，清除本地存储的无效 ID
        localStorage.removeItem('current_resume_id');
        setCurrentResumeId(null);
      }
    } finally {
      // 延迟关闭 loading 以获得更好的视觉感知
      setTimeout(() => setIsLoadingResume(false), 300);
    }
  }, [migrateV3]);

  useEffect(() => {
    const initFetch = async () => {
      if (!user) return; // 未登录时不请求数据

      try {
        const [historyData, resumesData] = await Promise.all([
          request.get('/api/history'),
          request.get('/api/resumes')
        ]);

        if (historyData) setHistoryList(historyData);

        const resumes = Array.isArray(resumesData) ? resumesData : [];
        setResumesList(resumes); // 更新简历列表状态
        
        const lastId = localStorage.getItem('current_resume_id');
        
        if (resumes.length > 0) {
          // 如果有上次打开的简历，且它还在列表中，则加载它
          const exists = resumes.find(r => r.id === lastId);
          const targetId = exists ? lastId : resumes[0].id;
          await fetchResumeDetail(targetId);
        } else {
          // 如果数据库是空的，自动创建一个默认简历
          const newId = `resume_${Date.now()}`;
          const defaultData = getEmptyResumeData(lang);
          const defaultConfig = {
            activeTemplate: 'modern',
            templates: {
              classic: { global: { sectionSpacing: 40, contentSpacing: 12, itemSpacing: 8, subItemSpacing: 4, baseFontSize: 9.5, titleFontSize: 11, themeColor: '#1a1a1a' }, personal_info: { sectionSpacing: 14 }, self_evaluation: { sectionSpacing: 17 }, education_background: { sectionSpacing: 25 }, project_experience: { sectionSpacing: 31 }, internship_experience: { sectionSpacing: 38 } },
              modern: { global: { sectionSpacing: 40, contentSpacing: 12, itemSpacing: 8, subItemSpacing: 4, baseFontSize: 9.5, titleFontSize: 11, themeColor: '#1a1a1a' }, personal_info: { sectionSpacing: 14 }, self_evaluation: { sectionSpacing: 17 }, education_background: { sectionSpacing: 25 }, project_experience: { sectionSpacing: 31 }, internship_experience: { sectionSpacing: 38 } },
              minimal: { global: { sectionSpacing: 40, contentSpacing: 12, itemSpacing: 8, subItemSpacing: 4, baseFontSize: 9.5, titleFontSize: 11, themeColor: '#1a1a1a' }, personal_info: { sectionSpacing: 14 }, self_evaluation: { sectionSpacing: 17 }, education_background: { sectionSpacing: 25 }, project_experience: { sectionSpacing: 31 }, internship_experience: { someKey: 'someValue' } },
            }
          };

          await request.post('/api/resumes', {
            id: newId,
            name: '我的第一份简历',
            data: defaultData,
            config: defaultConfig
          });
          await fetchResumeDetail(newId);
        }
      } catch (err) {
        if (err.response?.status === 401) {
          performLogout(); // 401 时自动退出，不弹确认框
        }
      }
    };
    initFetch();
  }, [lang, fetchResumeDetail, getEmptyResumeData, user, performLogout]);

  // 3. 辅助函数
  const getModuleConfig = useCallback((moduleId) => {
    const activeTemplate = config?.activeTemplate || 'classic';
    const currentTemplateConfig = config?.templates?.[activeTemplate] || {};
    const moduleConfig = currentTemplateConfig[moduleId] || {};
    const globalConfig = currentTemplateConfig.global || {};
    
    return {
      sectionSpacing: moduleConfig.sectionSpacing ?? globalConfig.sectionSpacing ?? 40,
      contentSpacing: moduleConfig.contentSpacing ?? globalConfig.contentSpacing ?? 12,
      itemSpacing: moduleConfig.itemSpacing ?? globalConfig.itemSpacing ?? 8,
      subItemSpacing: moduleConfig.subItemSpacing ?? globalConfig.subItemSpacing ?? 4,
      baseFontSize: moduleConfig.baseFontSize ?? globalConfig.baseFontSize ?? 9.5,
      titleFontSize: moduleConfig.titleFontSize ?? globalConfig.titleFontSize ?? 11,
    };
  }, [config]);

  const labels = resumeData[lang].labels;

  const getAtoms = useCallback(() => {
    const atoms = [];
    if (!data) return atoms;

    atoms.push({ type: 'personal_info', data: data.personal_info, moduleId: 'personal_info' });
    
    const sections = [
      { key: 'self_evaluation', label: labels.selfEvaluation, type: 'self-eval-item' },
      { key: 'education_background', label: labels.educationBackground, type: 'edu-item' }
    ];

    sections.forEach(sec => {
      atoms.push({ type: 'section-header', sectionTitle: sec.label, moduleId: sec.key });
      data[sec.key].forEach((item, idx) => {
        atoms.push({ 
          type: sec.type, data: item, idx, sectionTitle: sec.label, moduleId: sec.key,
          isLastInSection: idx === data[sec.key].length - 1 && (!item.bullets || item.bullets.length === 0)
        });
        
        // 处理教育背景的补充要点 (bullets)
        if (sec.key === 'education_background' && item.bullets && item.bullets.length > 0) {
          item.bullets.forEach((bullet, bIdx) => {
            atoms.push({
              type: 'edu-bullet', data: bullet, idx, bIdx, sectionTitle: sec.label, moduleId: sec.key,
              isLastInSection: idx === data[sec.key].length - 1 && bIdx === item.bullets.length - 1
            });
          });
        }
      });
    });

    // Project Experience
    atoms.push({ type: 'section-header', sectionTitle: labels.projectExperience, moduleId: 'project_experience' });
    data.project_experience.forEach((proj, idx) => {
      atoms.push({ type: 'proj-header', data: proj, idx, sectionTitle: labels.projectExperience, itemName: proj.project_name || proj.name, moduleId: 'project_experience' });
      const responsibilities = proj.responsibilities || proj.bullets || [];
      responsibilities.forEach((resp, rIdx) => {
        atoms.push({ 
          type: 'resp-item', data: resp, idx, rIdx, sectionTitle: labels.projectExperience, itemName: proj.project_name || proj.name, moduleId: 'project_experience',
          isLastInSection: (idx === data.project_experience.length - 1) && (rIdx === responsibilities.length - 1)
        });
      });
    });

    // Internship Experience
    atoms.push({ type: 'section-header', sectionTitle: labels.internshipExperience, moduleId: 'internship_experience' });
    data.internship_experience.forEach((intern, idx) => {
      atoms.push({ type: 'intern-header', data: intern, idx, sectionTitle: labels.internshipExperience, itemName: intern.company, moduleId: 'internship_experience' });
      const internProjects = intern.projects || [];
      internProjects.forEach((proj, pIdx) => {
        atoms.push({ type: 'intern-proj-header', data: proj, idx, pIdx, sectionTitle: labels.internshipExperience, itemName: proj.name, moduleId: 'internship_experience' });
        const details = proj.details || proj.bullets || [];
        details.forEach((detail, dIdx) => {
          atoms.push({ 
            type: 'intern-detail-item', data: detail, idx, pIdx, dIdx, sectionTitle: labels.internshipExperience, itemName: proj.name, moduleId: 'internship_experience',
            isLastInSection: (idx === data.internship_experience.length - 1) && (pIdx === internProjects.length - 1) && (dIdx === details.length - 1)
          });
        });
      });
    });

    return atoms;
  }, [data, labels]);

  // 4. 分页逻辑 Hook
  const pages = usePagination(measureRef, data, config, lang, getAtoms);

  // 5. 操作处理器
  const handleContentChange = (path, value) => {
    setData(prev => {
      const newData = JSON.parse(JSON.stringify(prev));
      const keys = path.split('.');
      let current = newData;
      for (let i = 0; i < keys.length - 1; i++) { current = current[keys[i]]; }
      current[keys[keys.length - 1]] = value;
      return newData;
    });
  };

  const handleSaveData = async () => {
    setIsSaving(true);
    try {
      // 1. 先保存到默认的 settings (保持旧版本兼容性)
      await request.post('/api/save-all', { config, data });
      
      // 2. 如果当前有选中的简历，则更新该简历
      if (currentResumeId) {
        await request.put(`/api/resumes/${currentResumeId}`, { config, data });
      }

      setLastSavedData(data);
      setLastSavedConfig(config);
      const historyData = await request.get('/api/history');
      setHistoryList(historyData);
      
      setIsSaving(false);
      showToast('同步成功');
    } catch {
      setIsSaving(false);
      alert('保存失败，请检查后端服务是否启动');
    }
  };

  const isDirty = useMemo(() => {
    return JSON.stringify(data) !== JSON.stringify(lastSavedData) || 
           JSON.stringify(config) !== JSON.stringify(lastSavedConfig);
  }, [data, config, lastSavedData, lastSavedConfig]);

  // 简历库相关操作
  const onSelectResume = useCallback(async (id) => {
    if (isDirty) {
      openConfirm({
        title: '切换简历',
        message: '当前修改尚未保存，确定要切换吗？未保存的内容将会丢失。',
        onConfirm: () => fetchResumeDetail(id)
      });
    } else {
      await fetchResumeDetail(id);
    }
  }, [isDirty, fetchResumeDetail, openConfirm]);

  const onDuplicateResume = useCallback(async (id) => {
    try {
      // 获取要克隆的简历详情
      const source = await request.get(`/api/resumes/${id}`);
      const newId = `resume_${Date.now()}`;
      await request.post('/api/resumes', {
        id: newId,
        name: `${source.name} (副本)`,
        data: source.data,
        config: source.config
      });
      // 刷新列表并切换到新克隆的简历
      const listData = await request.get('/api/resumes');
      setResumesList(Array.isArray(listData) ? listData : []);
      await fetchResumeDetail(newId);
    } catch {
      alert('克隆失败');
    }
  }, [fetchResumeDetail]);

  const onDeleteResume = useCallback(async (id) => {
    openConfirm({
      title: '删除简历',
      message: '确定要删除这份简历吗？此操作不可撤销。',
      type: 'danger',
      onConfirm: async () => {
        try {
          await request.delete(`/api/resumes/${id}`);
          // 刷新列表
          const listData = await request.get('/api/resumes');
          const newList = Array.isArray(listData) ? listData : [];
          setResumesList(newList);

          if (currentResumeId === id) {
            if (newList.length > 0) {
              await fetchResumeDetail(newList[0].id);
            } else {
              setCurrentResumeId(null);
              localStorage.removeItem('current_resume_id');
              setData(getEmptyResumeData(lang)); // 回到空白模板
            }
          }
        } catch {
          alert('删除失败');
        }
      }
    });
  }, [currentResumeId, lang, fetchResumeDetail, openConfirm]);

  const onCreateNewResume = useCallback(async () => {
    openConfirm({
      title: '创建新简历',
      message: '请输入新简历的名称',
      type: 'prompt',
      defaultValue: '未命名简历',
      onConfirm: async (name) => {
        if (!name) return;
        const newId = `resume_${Date.now()}`;
        const defaultData = getEmptyResumeData(lang);
        const defaultConfig = {
          activeTemplate: 'modern',
          templates: {
            classic: { global: { sectionSpacing: 40, contentSpacing: 12, itemSpacing: 8, subItemSpacing: 4, baseFontSize: 9.5, titleFontSize: 11, themeColor: '#1a1a1a' }, personal_info: { sectionSpacing: 14 }, self_evaluation: { sectionSpacing: 17 }, education_background: { sectionSpacing: 25 }, project_experience: { sectionSpacing: 31 }, internship_experience: { sectionSpacing: 38 } },
            modern: { global: { sectionSpacing: 40, contentSpacing: 12, itemSpacing: 8, subItemSpacing: 4, baseFontSize: 9.5, titleFontSize: 11, themeColor: '#1a1a1a' }, personal_info: { sectionSpacing: 14 }, self_evaluation: { sectionSpacing: 17 }, education_background: { sectionSpacing: 25 }, project_experience: { sectionSpacing: 31 }, internship_experience: { sectionSpacing: 38 } },
            minimal: { global: { sectionSpacing: 40, contentSpacing: 12, itemSpacing: 8, subItemSpacing: 4, baseFontSize: 9.5, titleFontSize: 11, themeColor: '#1a1a1a' }, personal_info: { sectionSpacing: 14 }, self_evaluation: { sectionSpacing: 17 }, education_background: { sectionSpacing: 25 }, project_experience: { sectionSpacing: 31 }, internship_experience: { sectionSpacing: 38 } },
          }
        };

        try {
          await request.post('/api/resumes', {
            id: newId,
            name,
            data: defaultData,
            config: defaultConfig
          });
          // 刷新列表并切换
          const listData = await request.get('/api/resumes');
          setResumesList(Array.isArray(listData) ? listData : []);
          await fetchResumeDetail(newId);
        } catch {
          alert('创建失败');
        }
      }
    });
  }, [lang, fetchResumeDetail, getEmptyResumeData, openConfirm]);

  const onSaveAsResume = useCallback(async () => {
    openConfirm({
      title: '另存为新简历',
      message: '请输入另存为的简历名称',
      type: 'prompt',
      defaultValue: '未命名简历_副本',
      onConfirm: async (name) => {
        if (!name) return;
        const newId = `resume_${Date.now()}`;
        try {
          await request.post('/api/resumes', {
            id: newId,
            name,
            data,
            config
          });
          // 刷新列表并切换
          const listData = await request.get('/api/resumes');
          setResumesList(Array.isArray(listData) ? listData : []);
          await fetchResumeDetail(newId);
          alert('另存为成功');
        } catch {
          alert('另存为失败');
        }
      }
    });
  }, [data, config, fetchResumeDetail, openConfirm]);

  const handleRestoreHistory = async (historyId) => {
    openConfirm({
      title: '恢复历史版本',
      message: '确定要恢复到此版本吗？当前未保存的修改将会丢失。',
      onConfirm: async () => {
        try {
          const resData = await request.get(`/api/history/${historyId}`);
          let { config: resConfig, data: resDataContent } = resData;
          // 处理旧格式... (省略重复的 migrate 逻辑以保持简洁，或提取为函数)
          setConfig(resConfig); setData(resDataContent);
          setLastSavedConfig(resConfig); setLastSavedData(resDataContent);
          setShowHistory(false); alert('已成功恢复');
        } catch { 
          alert('恢复失败'); 
        }
      }
    });
  };

  const handleExportPNG = async () => {
    setIsExporting(true);
    const pages = document.querySelectorAll('.print-area');
    try {
      const userName = data?.personal_info?.name || '我的简历';
      for (let i = 0; i < pages.length; i++) {
        const dataUrl = await toPng(pages[i], { pixelRatio: 3, backgroundColor: '#ffffff', style: { boxShadow: 'none', margin: '0' } });
        const link = document.createElement('a');
        link.download = `${userName} - 简历 - 第 ${i + 1} 页.png`;
        link.href = dataUrl; link.click();
      }
    } catch { 
      alert('导出图片失败'); 
    } finally {
      setIsExporting(false);
    }
  };

  const handleExportPDF = async () => {
    setIsExporting(true);
    const element = resumeRef.current;
    if (!element) {
      setIsExporting(false);
      return;
    }
    const styles = Array.from(document.querySelectorAll('style, link[rel="stylesheet"]')).map(s => s.outerHTML).join('\n');
    const clonedElement = element.cloneNode(true);
    clonedElement.querySelectorAll('img').forEach(img => {
      img.src = img.src.replace(window.location.origin, 'http://localhost:3000');
    });

    const htmlContent = `<!DOCTYPE html><html><head><meta charset="utf-8">${styles}<style>body{background:white!important;margin:0;padding:0;-webkit-print-color-adjust:exact;}.no-print{display:none!important;}.print-area{box-shadow:none!important;margin:0!important;width:210mm!important;}[contenteditable="true"]{outline:none!important;background:transparent!important;}</style></head><body>${clonedElement.outerHTML}</body></html>`;

    try {
      const userName = data?.personal_info?.name || '我的简历';
      const targetPosition = data?.personal_info?.target_position?.split('|')[0]?.trim() || '';
      const pdfFilename = `${userName}${targetPosition ? ' - ' + targetPosition : ''}.pdf`;

      const response = await fetch('/api/export-pdf', {
        method: 'POST', headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem('lumi_token')}` },
        body: JSON.stringify({ html: htmlContent, filename: pdfFilename }),
      });
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a'); a.href = url; a.download = pdfFilename;
      document.body.appendChild(a); a.click(); document.body.removeChild(a);
    } catch { 
      alert('PDF 导出失败'); 
    } finally {
      setIsExporting(false);
    }
  };

  if (!user) {
    return <LoginPage onLoginSuccess={onLoginSuccess} />;
  }

  return (
    <div className="min-h-screen bg-zinc-200 no-print flex flex-col md:flex-row overflow-hidden relative">
      {/* 移动端顶部状态栏 (仅移动端显示) */}
      <div className="md:hidden bg-white/80 backdrop-blur-md border-b border-zinc-300 p-3 flex items-center justify-between z-[70] sticky top-0 shrink-0">
        <button 
          onClick={() => setShowSidebar(!showSidebar)}
          className="p-2 hover:bg-zinc-100 rounded-xl transition-all active:scale-90"
        >
          <Layout size={20} />
        </button>
        <div className="flex items-center gap-2">
          <Sparkles className="text-amber-500" size={18} />
          <span className="font-black text-sm tracking-tight">Lumi 简历</span>
        </div>
        <button 
          onClick={() => setShowContentDrawer(!showContentDrawer)}
          className="p-2 bg-black text-white rounded-xl transition-all active:scale-90 shadow-lg shadow-zinc-200"
        >
          <Settings size={20} />
        </button>
      </div>

      {/* 侧边栏 (响应式：移动端为抽屉，PC端为侧边栏) */}
      <div 
        className={`fixed md:relative z-[80] md:z-[60] transition-all duration-300 ease-in-out h-full
          ${showSidebar ? 'translate-x-0 w-full md:w-72 opacity-100' : '-translate-x-full md:translate-x-0 md:w-0 opacity-0 overflow-hidden'}
        `}
      >
        {/* 移动端遮罩层 */}
        {showSidebar && (
          <div 
            className="md:hidden fixed inset-0 bg-black/40 backdrop-blur-sm z-[-1]" 
            onClick={() => setShowSidebar(false)}
          />
        )}

        <Sidebar 
          config={config} 
          setConfig={setConfig} 
          isDirty={isDirty} 
          onClose={() => setShowSidebar(false)}
          currentResumeId={currentResumeId}
          onSelectResume={onSelectResume}
          onDuplicateResume={onDuplicateResume}
          onDeleteResume={onDeleteResume}
          onCreateNewResume={onCreateNewResume}
          user={user}
          onLogout={onLogout}
          resumes={resumesList} // 传递简历列表
        />
      </div>

      {/* 主编辑预览区 */}
      <div className="flex-1 flex flex-col min-w-0 relative h-full md:h-screen">
        {/* 顶部操作栏 - 响应式优化 */}
        <header className="bg-white/80 backdrop-blur-md border-b border-zinc-300 p-3 md:p-4 flex items-center justify-between gap-3 sticky top-0 z-50 shrink-0 overflow-x-auto no-scrollbar">
          <div className="flex items-center gap-2 md:gap-3 shrink-0">
            <button 
              onClick={() => setShowSidebar(!showSidebar)}
              className="hidden md:flex p-2 hover:bg-zinc-100 rounded-xl transition-all"
              title="切换侧边栏"
            >
              <Layout size={20} className={showSidebar ? 'text-black' : 'text-zinc-400'} />
            </button>
            <div className="h-6 w-px bg-zinc-200 hidden md:block" />
            <div className="flex bg-zinc-100 p-1 rounded-xl">
              <button 
                onClick={() => setLang('zh')} 
                className={`px-3 py-1.5 rounded-lg text-[10px] md:text-xs font-black transition-all ${lang === 'zh' ? 'bg-white text-black shadow-sm' : 'text-zinc-400 hover:text-zinc-600'}`}
              >
                ZH
              </button>
              <button 
                onClick={() => setLang('en')} 
                className={`px-3 py-1.5 rounded-lg text-[10px] md:text-xs font-black transition-all ${lang === 'en' ? 'bg-white text-black shadow-sm' : 'text-zinc-400 hover:text-zinc-600'}`}
              >
                EN
              </button>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button 
              onClick={() => togglePanel('settings')} 
              className={`p-2 md:px-4 md:py-2.5 rounded-xl flex items-center gap-2 transition-all font-bold text-xs ${showSettings ? 'bg-black text-white shadow-lg shadow-zinc-200' : 'bg-zinc-100 hover:bg-zinc-200 text-zinc-700'}`}
            >
              <Settings size={18} /> <span className="hidden sm:inline">排版设置</span>
            </button>
            <button 
              onClick={() => togglePanel('content')} 
              className={`p-2 md:px-4 md:py-2.5 rounded-xl flex items-center gap-2 transition-all font-bold text-xs ${showContentDrawer ? 'bg-black text-white shadow-lg shadow-zinc-200' : 'bg-zinc-100 hover:bg-zinc-200 text-zinc-700'}`}
            >
              <Layout size={18} /> <span className="hidden sm:inline">内容编辑</span>
            </button>
            <button 
              onClick={() => togglePanel('color')} 
              className={`p-2 md:px-4 md:py-2.5 rounded-xl flex items-center gap-2 transition-all font-bold text-xs ${showColorPicker ? 'bg-black text-white shadow-lg shadow-zinc-200' : 'bg-white border border-zinc-200 hover:border-zinc-400 text-zinc-700'}`}
            >
              <Palette size={18} /> <span className="hidden sm:inline">配色方案</span>
            </button>
            <button 
              onClick={() => togglePanel('history')} 
              className={`p-2 md:px-4 md:py-2.5 rounded-xl flex items-center gap-2 transition-all font-bold text-xs ${showHistory ? 'bg-black text-white shadow-lg shadow-zinc-200' : 'bg-white border border-zinc-200 hover:border-zinc-400 text-zinc-700'}`}
            >
              <History size={18} /> <span className="hidden sm:inline">版本记录</span>
            </button>
          </div>

          <div className="flex items-center gap-2 shrink-0 ml-auto sm:ml-0">
            <button onClick={handleSaveData} disabled={isSaving || !isDirty} className={`${(isSaving || !isDirty) ? 'bg-zinc-200 text-zinc-400 cursor-not-allowed' : 'bg-black hover:bg-zinc-800 text-white'} px-4 py-2.5 rounded-xl flex items-center gap-2 transition-all active:scale-95 font-bold text-xs shadow-lg`}>
              <Save size={18} className={isSaving ? 'animate-pulse' : ''} /> <span className="hidden lg:inline">{isSaving ? labels.saving : labels.saveData}</span>
            </button>
            
            <button 
              onClick={onSaveAsResume}
              className="hidden sm:flex p-2 md:px-4 md:py-2.5 bg-white border border-zinc-200 hover:border-zinc-400 text-zinc-700 rounded-xl items-center gap-2 transition-all font-bold text-xs"
              title="另存为新简历"
            >
              <Copy size={18} /> <span className="hidden lg:inline">另存为</span>
            </button>

            <div className="flex bg-black rounded-xl overflow-hidden shadow-lg">
              <button 
                onClick={handleExportPNG} 
                disabled={isExporting} 
                className={`${isExporting ? 'opacity-50 cursor-not-allowed' : 'hover:bg-zinc-800'} text-white px-4 py-2.5 flex items-center gap-2 transition-all font-bold text-xs border-r border-white/10`}
                title="导出图片"
              >
                <Image size={18} /> <span className="hidden lg:inline">PNG</span>
              </button>
              <button 
                onClick={handleExportPDF} 
                disabled={isExporting} 
                className={`${isExporting ? 'opacity-50 cursor-not-allowed' : 'hover:bg-zinc-800'} text-white px-4 py-2.5 flex items-center gap-2 transition-all font-bold text-xs`}
                title="导出 PDF"
              >
                <Download size={18} /> <span className="hidden lg:inline">PDF</span>
              </button>
            </div>
          </div>
        </header>

        {/* 主内容区 - 响应式分屏 */}
        <main className="flex-1 flex flex-col md:flex-row overflow-hidden relative">
          {/* 左侧编辑中心 (PC端 50%) */}
          <div className={`
            hidden md:block transition-all duration-500 ease-in-out overflow-hidden border-r border-zinc-300 bg-white
            ${showContentDrawer ? 'w-1/2 opacity-100' : 'w-0 opacity-0'}
          `}>
            <ContentDrawer 
              show={true} 
              onClose={() => setShowContentDrawer(false)} 
              data={data} 
              setData={setData}
              config={config}
              showSidebar={showSidebar}
              labels={labels}
              openConfirm={openConfirm}
              showToast={showToast}
            />
          </div>

          {/* 移动端编辑抽屉 (仅移动端) */}
          <div className={`
            md:hidden fixed inset-0 z-[100] transition-all duration-300
            ${showContentDrawer ? 'translate-y-0': 'translate-y-full'}
          `}>
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setShowContentDrawer(false)} />
            <div className="absolute inset-x-0 bottom-0 top-16 bg-white rounded-t-[32px] overflow-hidden flex flex-col">
              <div className="h-1.5 w-12 bg-zinc-200 rounded-full mx-auto my-4 shrink-0" />
              <div className="flex-1 overflow-hidden">
                <ContentDrawer 
                  show={true} 
                  onClose={() => setShowContentDrawer(false)} 
                  data={data} 
                  setData={setData}
                  config={config}
                  showSidebar={showSidebar}
                  labels={labels}
                  openConfirm={openConfirm}
                  showToast={showToast}
                />
              </div>
            </div>
          </div>

          {/* 右侧预览区 */}
          <div className={`
            flex-1 overflow-y-auto bg-zinc-200 p-4 md:p-8 flex flex-col items-center custom-scrollbar transition-all duration-500 relative
            ${showContentDrawer ? 'md:w-1/2' : 'w-full'}
          `}>
            {/* 切换简历时的加载遮罩 */}
            {isLoadingResume && (
              <div className="absolute inset-0 z-[100] bg-zinc-200/40 backdrop-blur-md flex flex-col items-center justify-center animate-in fade-in duration-300">
                <div className="w-12 h-12 border-4 border-white border-t-black rounded-full animate-spin mb-4" />
                <span className="text-xs font-black text-zinc-900 tracking-widest uppercase">正在载入简历数据...</span>
              </div>
            )}

            {/* 预览控制浮窗 */}
            <div className="fixed bottom-6 right-6 z-40 flex flex-col gap-2">
               <div className="bg-white/90 backdrop-blur shadow-2xl rounded-2xl border border-zinc-200 p-1.5 flex flex-col gap-1">
                  <button 
                    onClick={() => setZoom(prev => Math.min(prev + 0.1, 2))}
                    className="p-2.5 hover:bg-zinc-100 rounded-xl transition-all text-zinc-600"
                    title="放大"
                  >
                    <Plus size={18} />
                  </button>
                  <div className="h-px bg-zinc-100 mx-2" />
                  <div className="py-1 text-[10px] font-black text-center text-zinc-400">
                    {Math.round(zoom * 100)}%
                  </div>
                  <div className="h-px bg-zinc-100 mx-2" />
                  <button 
                    onClick={() => setZoom(prev => Math.max(prev - 0.1, 0.3))}
                    className="p-2.5 hover:bg-zinc-100 rounded-xl transition-all text-zinc-600"
                    title="缩小"
                  >
                    <Minus size={18} />
                  </button>
               </div>
               
               <button 
                 onClick={() => {
                   if (window.innerWidth < 768) setZoom(0.5);
                   else setZoom(0.9);
                 }}
                 className="bg-white/90 backdrop-blur shadow-2xl rounded-2xl border border-zinc-200 p-3 text-zinc-600 hover:text-black transition-all"
                 title="重置缩放"
               >
                 <RotateCcw size={18} />
               </button>
            </div>

            <div 
              className="relative transition-all duration-500"
              style={{ 
                height: `${zoom * 1122 * pages.length}px`, 
                width: `${zoom * 794}px`,
                minWidth: 'min(100%, 794px)'
              }}
            >
              <div 
                ref={resumeRef} 
                className="absolute top-0 left-1/2 -translate-x-1/2 transform-gpu transition-transform duration-500 origin-top flex flex-col items-center shadow-2xl"
                style={{ transform: `scale(${zoom})` }}
              >
                {pages.length > 0 ? (
                  pages.map((pageAtoms, pIdx) => (
                    <Page key={pIdx} activeTemplate={config.activeTemplate} templates={config.templates}>
                      {pageAtoms.map((atom, aIdx) => (
                        <ResumeAtom key={aIdx} atom={atom} config={config} data={data} labels={labels} handleContentChange={handleContentChange} getModuleConfig={getModuleConfig} />
                      ))}
                    </Page>
                  ))
                ) : (
                  <div className="text-zinc-400 font-medium py-20">正在生成分页预览...</div>
                )}
              </div>
            </div>

            {/* 用于测量的隐藏容器 */}
            <div 
              ref={measureRef} 
              className={`absolute opacity-0 pointer-events-none ${config.activeTemplate === 'minimal' ? 'font-sans' : 'font-academic'} text-[#1a1a1a]`} 
              style={{ width: '210mm', padding: '32px', left: '-9999px', top: 0, fontSize: `${config.templates?.[config.activeTemplate]?.global?.baseFontSize || 9.5}pt` }}
            >
              {getAtoms().map((atom, idx) => (
                <ResumeAtom key={idx} atom={atom} isMeasurement={true} config={config} data={data} labels={labels} handleContentChange={handleContentChange} getModuleConfig={getModuleConfig} />
              ))}
            </div>
          </div>
        </main>
      </div>

      <HistoryModal showHistory={showHistory} setShowHistory={setShowHistory} historyList={historyList} handleRestoreHistory={handleRestoreHistory} />
      <ColorPickerModal showColorPicker={showColorPicker} setShowColorPicker={setShowColorPicker} config={config} setConfig={setConfig} />
      <SettingsModal showSettings={showSettings} setShowSettings={setShowSettings} activeModule={activeModule} setActiveModule={setActiveModule} config={config} setConfig={setConfig} />
      
      <ConfirmModal 
        show={confirmModal.show}
        title={confirmModal.title}
        message={confirmModal.message}
        type={confirmModal.type}
        defaultValue={confirmModal.defaultValue}
        onConfirm={confirmModal.onConfirm}
        onCancel={confirmModal.onCancel}
      />

      <Toast 
        show={toast.show}
        message={toast.message}
        type={toast.type}
        onClose={() => setToast(prev => ({ ...prev, show: false }))}
      />
    </div>
  );
};

export default ResumeEditor;
