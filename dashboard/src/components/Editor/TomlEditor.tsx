import React, { ForwardRefRenderFunction, forwardRef } from 'react';
import CodeMirror from 'codemirror';
import Editor, { CodeEditorProps } from './Editor';

import toml from 'toml';
import 'codemirror/mode/toml/toml';

window.toml = toml;

CodeMirror.registerHelper('lint', 'toml', function (text: string) {
  let found: any[] = [];
  if (!window.toml) {
    if (window.console) {
      window.console.error('Error: window.toml not defined, CodeMirror TOML linting cannot run.');
    }
    return found;
  }

  try {
    window.toml.parse(text);
  } catch (e) {
    let line = e.line;
    let column = e.column;
    let from = CodeMirror.Pos(line, column);
    let to = from;
    found.push({ from: from, to: to, message: e.message });
  }
  return found;
});

export interface TomlEditorProps extends Omit<CodeEditorProps, 'mode'> {}

const TomlEditor: ForwardRefRenderFunction<any, TomlEditorProps> = (props, ref) => {
  return <Editor {...props} mode="text/x-toml" ref={ref} />;
};

export default forwardRef(TomlEditor);
