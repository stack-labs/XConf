import { NamespaceFormat } from '@src/typings';

const ContentTypeExtMap = {
  [NamespaceFormat.CUSTOM]: { ext: '.txt', contentType: 'text/plain' },
  [NamespaceFormat.TOML]: { ext: '.toml', contentType: 'text/x-toml' },
  [NamespaceFormat.YAML]: { ext: '.yaml', contentType: 'text/x-yaml' },
  [NamespaceFormat.JSON]: { ext: '.json', contentType: 'application/json' },
};

export const downloadFile = (filename: string, content: string, format: NamespaceFormat = NamespaceFormat.CUSTOM) => {
  const a = document.createElement('a');
  const { ext, contentType } = ContentTypeExtMap[format] || ContentTypeExtMap[NamespaceFormat.CUSTOM];
  a.download = `${filename}${ext}`;

  const urlObject = window.URL || window.webkitURL || window;
  const blob = new Blob([content], { type: contentType });
  a.href = urlObject.createObjectURL(blob);

  a.click();
};

export const uploadFile = (callback: (files: FileList) => void, ext: NamespaceFormat = NamespaceFormat.CUSTOM) => {
  let extension = '*';
  if (ext === NamespaceFormat.JSON) extension = '.json';
  else if (ext === NamespaceFormat.YAML) extension = '.yml,.yaml';
  else if (ext === NamespaceFormat.TOML) extension = '.tml,.toml';

  const input = document.createElement('input');
  input.type = 'file';
  input.accept = extension;

  input.click();
  input.onchange = () => {
    const files = input.files;
    if (files?.length) callback(files);
  };
};

export const readFile = (file: File, callback: (value: string) => void) => {
  const reader = new FileReader();
  reader.readAsText(file, 'utf8');
  reader.onload = function (e) {
    const content = e?.target?.result?.toString() || '';
    callback(content);
  };
};
