import React, { ForwardRefRenderFunction, forwardRef } from 'react';
import Editor, { CodeEditorProps } from './Editor';

import 'codemirror/mode/toml/toml';

export interface TomlEditorProps extends Omit<CodeEditorProps, 'mode'> {}

const TomlEditor: ForwardRefRenderFunction<any, TomlEditorProps> = (props, ref) => {
  return <Editor {...props} mode="text/x-toml" ref={ref} />;
};

export default forwardRef(TomlEditor);
