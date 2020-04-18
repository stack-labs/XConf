import React, { ForwardRefRenderFunction, forwardRef } from 'react';
import Editor, { CodeEditorProps } from './Editor';

import jsonlint from 'jsonlint-mod';
import 'codemirror/mode/javascript/javascript';
import 'codemirror/addon/lint/json-lint';

window.jsonlint = jsonlint;

export interface JsonEditorProps extends Omit<CodeEditorProps, 'mode'> {}

const JsonEditor: ForwardRefRenderFunction<any, JsonEditorProps> = (props, ref) => {
  return <Editor {...props} mode="application/json" ref={ref} />;
};

export default forwardRef(JsonEditor);
