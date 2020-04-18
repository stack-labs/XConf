import React, { FC, useRef } from 'react';
import { Col, Form, Row, Tag, message } from 'antd';

import Editor from '@src/components/Editor';
import { renderNamespaceRelease } from '@src/renders';
import { saveConfig } from '@src/services';
import { Namespace, NamespaceFormat } from '@src/typings';
import ReleaseModel from '@src/pages/App/ReleaseModel';

export interface NamespaceInfoProps {
  namespace: Namespace;
  canControl?: boolean;
  callback?: Function;
}

const NamespaceInfo: FC<NamespaceInfoProps> = ({ namespace, canControl, callback }) => {
  const callbackRef = useRef(callback);
  callbackRef.current = callback;

  return (
    <Form>
      <Row>
        <Col span={6}>
          <Form.Item label="格式" labelCol={{ span: 8 }} wrapperCol={{ span: 16 }}>
            <Tag color="green">{namespace.format}</Tag>
          </Form.Item>
        </Col>
        <Col span={6}>
          <Form.Item label="状态" labelCol={{ span: 8 }} wrapperCol={{ span: 16 }}>
            {renderNamespaceRelease(namespace)}
          </Form.Item>
        </Col>
      </Row>
      <Form.Item name="configuration" label="配置" labelCol={{ span: 2 }} wrapperCol={{ span: 22 }}>
        <Editor
          canControl={canControl}
          format={namespace.format}
          initialValue={namespace.released ? namespace.value : namespace.editValue}
          onSave={(value: string, format: NamespaceFormat) => {
            saveConfig({
              appName: namespace.appName,
              clusterName: namespace.clusterName,
              namespaceName: namespace.namespaceName,
              format,
              value,
            })
              .then(() => {
                const callback = callbackRef.current;
                callback && callback();
                message.success('配置保存成功');
              })
              .catch((e) => message.error('保存失败:', e.message));
          }}
          onRelease={() => {
            ReleaseModel({
              appName: namespace.appName,
              clusterName: namespace.clusterName,
              namespaceName: namespace.namespaceName,
              onOk: () => {
                message.success('配置发布成功');
                const callback = callbackRef.current;
                callback && callback();
              },
            });
          }}
        />
      </Form.Item>
    </Form>
  );
};

export default NamespaceInfo;
