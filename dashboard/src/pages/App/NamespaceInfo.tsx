import React, { FC, useRef } from 'react';
import { useTranslation } from 'react-i18next';
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

  const { t } = useTranslation();

  return (
    <Form>
      <Row>
        <Col span={6}>
          <Form.Item label={t('form.creation.format')} labelCol={{ span: 8 }} wrapperCol={{ span: 16 }}>
            <Tag color="green">{namespace.format}</Tag>
          </Form.Item>
        </Col>
        <Col span={6}>
          <Form.Item label={t('form.creation.status')} labelCol={{ span: 8 }} wrapperCol={{ span: 16 }}>
            {renderNamespaceRelease(namespace, t)}
          </Form.Item>
        </Col>
      </Row>
      <Form.Item
        name="configuration"
        label={t('form.creation.configuration')}
        labelCol={{ span: 2 }}
        wrapperCol={{ span: 22 }}
      >
        <Editor
          canControl={canControl}
          format={namespace.format}
          released={namespace.released}
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
                message.success(t('form.creation.namespace.save.success'));
              })
              .catch((e) => message.error(t('form.creation.namespace.save.failure') + ': ' + e.message));
          }}
          onRelease={() => {
            ReleaseModel({
              appName: namespace.appName,
              clusterName: namespace.clusterName,
              namespaceName: namespace.namespaceName,
              onOk: () => {
                message.success(t('form.creation.namespace.release.success'));
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
