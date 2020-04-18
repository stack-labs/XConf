import React, { ForwardRefRenderFunction, forwardRef } from 'react';
import Editor, { CodeEditorProps } from './Editor';

import jsyaml from 'js-yaml';
import 'codemirror/mode/yaml/yaml';
import 'codemirror/addon/lint/yaml-lint';

window.jsyaml = jsyaml;

export interface YamlEditorProps extends Omit<CodeEditorProps, 'mode'> {}

const YamlEditor: ForwardRefRenderFunction<any, YamlEditorProps> = (props, ref) => {
  return <Editor {...props} mode="text/x-yaml" ref={ref} />;
};

export default forwardRef(YamlEditor);
