import { useState, useEffect } from 'react';

/**
 * 自动分页逻辑 Hook
 */
export const usePagination = (measureRef, data, config, lang, getAtoms) => {
  const [pages, setPages] = useState([]);

  useEffect(() => {
    const performPagination = () => {
      if (!measureRef.current) return;

      const PAGE_HEIGHT = 1122; // A4 height in px
      const PADDING = 32 * 2; // p-8 is 32px
      const SAFETY_MARGIN = 5; // 减小安全余量，让页面填充更紧凑
      const MAX_CONTENT_HEIGHT = PAGE_HEIGHT - PADDING - SAFETY_MARGIN;
      
      const atomElements = Array.from(measureRef.current.children);
      const atomData = getAtoms();
      
      const newPages = [];
      let currentPageItems = [];
      let currentHeight = 0;

      atomData.forEach((data, index) => {
        const element = atomElements[index];
        if (!element) return;

        // 使用 getBoundingClientRect().height 获取带小数的精确高度
        const atomHeight = element.getBoundingClientRect().height;
        
        // 优化“粘性标题”逻辑：防止标题（板块标题或项目标题）单独留在页面底部
        let forceNewPage = false;
        const stickyTypes = ['section-header', 'proj-header', 'intern-header', 'intern-proj-header'];
        
        if (stickyTypes.includes(data.type) && index + 1 < atomData.length) {
          const nextElement = atomElements[index + 1];
          if (nextElement) {
            const nextHeight = nextElement.getBoundingClientRect().height;
            // 如果“标题 + 下一个条目”的总高度超出了当前页剩余空间，则将标题一起移到下一页
            if (currentHeight + atomHeight + nextHeight > MAX_CONTENT_HEIGHT) {
              forceNewPage = true;
            }
          }
        }

        // 如果加上这个原子会超出当前页，或者触发了强制换页
        if (forceNewPage || (currentHeight + atomHeight > MAX_CONTENT_HEIGHT)) {
          // 保存当前页
          if (currentPageItems.length > 0) {
            newPages.push([...currentPageItems]);
            currentPageItems = [];
            currentHeight = 0;
          }
        }

        currentPageItems.push(data);
        currentHeight += atomHeight;
      });

      if (currentPageItems.length > 0) {
        newPages.push(currentPageItems);
      }

      setPages(newPages);
    };

    // 延迟执行以确保测量准确
    const timer = setTimeout(performPagination, 500);
    return () => clearTimeout(timer);
  }, [data, config, lang, measureRef, getAtoms]);

  return pages;
};
