import React, { useState, useRef } from 'react';
import { renderMarkdown } from '../utils/markdown';

const EditableContent = ({ initialValue, onSave, className, style, tag = 'div' }) => {
  const Tag = tag;
  const [isEditing, setIsEditing] = useState(false);
  const [currentValue, setCurrentValue] = useState(initialValue);
  const [prevInitialValue, setPrevInitialValue] = useState(initialValue);
  const contentRef = useRef(null);

  // 同步外部 prop 到内部 state 的推荐做法（避免 useEffect 级联渲染）
  if (initialValue !== prevInitialValue) {
    setPrevInitialValue(initialValue);
    setCurrentValue(initialValue);
  }

  const handleBlur = () => {
    setIsEditing(false);
    if (contentRef.current) {
      const newValue = contentRef.current.innerText;
      setCurrentValue(newValue);
      onSave(newValue);
    }
  };

  const handleKeyDown = (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'b') {
      e.preventDefault();
      const selection = window.getSelection();
      if (!selection.rangeCount) return;

      const range = selection.getRangeAt(0);
      const selectedText = range.toString();
      
      let newText;
      if (selectedText.startsWith('**') && selectedText.endsWith('**')) {
        newText = selectedText.slice(2, -2);
      } else {
        newText = `**${selectedText}**`;
      }

      // 使用 execCommand 是最简单的方式来处理 contentEditable 中的加粗逻辑
      // 虽然 execCommand 已被废弃，但在现代浏览器中仍然有效且处理文本替换最方便
      document.execCommand('insertText', false, newText);
    }
  };

  if (isEditing) {
    return (
      <Tag
        ref={contentRef}
        contentEditable
        suppressContentEditableWarning
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        className={`${className} outline-none focus:bg-zinc-50/50 rounded px-1 -mx-1`}
        style={style}
        autoFocus
      >
        {currentValue}
      </Tag>
    );
  }

  return (
    <Tag
      onClick={() => setIsEditing(true)}
      className={`${className} cursor-text hover:bg-zinc-50/50 rounded px-1 -mx-1`}
      style={style}
    >
      {renderMarkdown(currentValue)}
    </Tag>
  );
};

export default EditableContent;
