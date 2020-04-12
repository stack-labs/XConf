import React, { ForwardRefRenderFunction, forwardRef } from 'react';
import { Button, Input } from 'antd';
import CodeMirror from 'codemirror';
import { CodeEditorProps } from '@src/components/Editor/Editor';
import { NamespaceFormat } from '@src/typings';

import JsonEditor from './JsonEditor';
import YamlEditor from './YamlEditor';
import TomlEditor from './TomlEditor';

import styles from './index.module.scss';

window.CodeMirror = CodeMirror;

export { default as JsonEditor } from './JsonEditor';
export { default as YamlEditor } from './YamlEditor';
export { default as TomlEditor } from './TomlEditor';

export interface EditorProps extends Omit<CodeEditorProps, 'mode'> {
  format: NamespaceFormat;
  value?: string;
}

const Editor: ForwardRefRenderFunction<any, EditorProps> = ({ format, value, ...props }, ref) => {
  const renderEditor = () => {
    if (format === NamespaceFormat.CUSTOM)
      return (
        <Input.TextArea
          defaultValue={props.initialValue}
          ref={ref}
          rows={8}
          readOnly={props.readonly}
          value={value}
          onChange={(e) => props.onChange && props.onChange(e.target.value)}
        />
      );

    if (format === NamespaceFormat.JSON) return <JsonEditor {...props} ref={ref} />;
    if (format === NamespaceFormat.YAML) return <YamlEditor {...props} ref={ref} />;
    if (format === NamespaceFormat.TOML) return <TomlEditor {...props} ref={ref} />;
    return null;
  };

  return (
    <div>
      {renderEditor()}
      <div className={styles.buttonLayout}>
        <Button type="primary">保存</Button>
        <Button type="danger">发布</Button>
      </div>
    </div>
  );
};

export default forwardRef(Editor);
