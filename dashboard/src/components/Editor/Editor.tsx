import React, { ForwardRefRenderFunction, forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react';

import CodeMirror, { Editor } from 'codemirror';
import 'codemirror/addon/lint/lint';
import 'codemirror/lib/codemirror.css';
import 'codemirror/theme/material.css';
import 'codemirror/addon/lint/lint.css';

import styles from './index.module.scss';

export interface CodeEditorProps {
  mode: string;
  readonly?: boolean;
  placeholder?: React.ReactNode;
  height?: string | number;
  initialValue?: string;
  onChange?: (value: string) => void;
}

const CodeEditor: ForwardRefRenderFunction<any, CodeEditorProps> = (
  { mode, initialValue, onChange, readonly, height },
  ref,
) => {
  const domCurrent = useRef<any>(null);
  const editorCurrent = useRef<Editor | null>(null);
  const _onChange = useRef<any>(onChange);
  _onChange.current = onChange;

  useImperativeHandle(ref, () => editorCurrent.current);

  const [value, setValue] = useState<string>('');

  useEffect(() => {
    const dom = domCurrent.current;
    if (dom) {
      const editor = CodeMirror(dom, {
        value: '',
        mode,
        theme: 'material',
        lint: true,
        gutters: ['CodeMirror-lint-markers'],
        lineNumbers: true,
      });
      editor.on('change', (editor) => setValue(editor.getValue()));
      editorCurrent.current = editor;
    }
  }, [mode]);

  useEffect(() => {
    const fn = _onChange.current;
    fn && fn(value);
  }, [value]);

  useEffect(() => {
    const editor = editorCurrent.current;
    editor && editor.setOption('readOnly', readonly);
  }, [readonly]);

  useEffect(() => {
    const editor = editorCurrent.current;
    if (editor) editor.setSize('100%', height || 500);
  }, [height]);

  useEffect(() => {
    const editor = editorCurrent.current;
    if (editor) editor.setValue(initialValue || '');
  }, [initialValue]);

  return (
    <div className={styles.editor}>
      <div ref={domCurrent} />
    </div>
  );
};

export default forwardRef(CodeEditor);
