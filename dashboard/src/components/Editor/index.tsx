import React, { ForwardRefRenderFunction, forwardRef } from 'react';
import { Button, Input, message } from 'antd';
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

export const validateFormat = (value: string, format: NamespaceFormat): [boolean, string?] => {
  if (format === NamespaceFormat.CUSTOM) return [true];
  let validate;
  if (format === NamespaceFormat.JSON) validate = window.jsonlint.parse;
  else if (format === NamespaceFormat.YAML) validate = window.jsyaml.loadAll;
  else if (format === NamespaceFormat.TOML) validate = window.toml.parse;

  try {
    validate(value);
    return [true];
  } catch (e) {
    return [false, e.message];
  }
};

export interface EditorProps extends Omit<CodeEditorProps, 'mode'> {
  canControl?: boolean;
  format: NamespaceFormat;
  value?: string;
  released: boolean;

  onSave?: (value: string, format: NamespaceFormat) => void;
  onRelease?: (value: string, format: NamespaceFormat) => void;
}

const Editor: ForwardRefRenderFunction<any, EditorProps> = (
  { canControl, format, value, released, onSave, onRelease, ...props },
  ref,
) => {
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
      {canControl && (
        <div className={styles.buttonLayout}>
          <Button
            type="primary"
            onClick={() => {
              const v = value || '';
              const [result, msg] = validateFormat(v, format);
              if (result) onSave && onSave(v, format);
              else message.error(`格式错误: ${msg}`);
            }}
          >
            保存
          </Button>
          <Button
            type="danger"
            disabled={released}
            onClick={() => {
              const v = value || '';
              const [result, msg] = validateFormat(v, format);
              if (result) onRelease && onRelease(v, format);
              else message.error(`格式错误: ${msg}`);
            }}
          >
            发布
          </Button>
        </div>
      )}
    </div>
  );
};

export default forwardRef(Editor);
