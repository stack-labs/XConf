import React, { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { Button, Col, Form, Input, Modal, Row, Select, message } from 'antd';
import { ModalProps } from 'antd/lib/modal';

import { withModal } from '@src/hoc';
import { createNamespace } from '@src/services';
import { NamespaceCreation, NamespaceFormat } from '@src/typings';

const halfFormLayout = { labelCol: { span: 8 }, wrapperCol: { span: 16 } };

export interface NamespaceCreateProps extends Omit<ModalProps, 'onOk' | 'onCancel'> {
  appName: string;
  clusterName: string;
  onOk?: () => void;
  onCancel?: () => void;
}

const NamespaceCreate: FC<NamespaceCreateProps> = ({ appName, clusterName, onOk, ...props }) => {
  const { t } = useTranslation();

  const existNamespace = async (rule: any, value: string, callback: (error?: string) => void) => {
    return;
  };

  const formats = Object.values(NamespaceFormat);
  return (
    <Modal {...props} footer={null}>
      <Form
        labelCol={{ span: 4 }}
        wrapperCol={{ span: 20 }}
        initialValues={{ appName, clusterName, format: formats[0] || '' }}
        onFinish={(values) =>
          createNamespace(values as NamespaceCreation)
            .then(() => {
              onOk && onOk();
              props.onCancel && props.onCancel();
            })
            .catch((err) => message.error(t('form.creation.namespace.failure') + `: ${err}`))
        }
      >
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item label={t('form.creation.appName')} name="appName" {...halfFormLayout}>
              <Input readOnly />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label={t('form.creation.clusterName')} name="clusterName" {...halfFormLayout}>
              <Input readOnly />
            </Form.Item>
          </Col>
        </Row>
        <Form.Item
          label={t('form.creation.namespace')}
          name="namespaceName"
          rules={[{ required: true, message: t('form.creation.namespace.validation') }, { validator: existNamespace }]}
        >
          <Input placeholder={t('form.creation.namespace.placeholder')} />
        </Form.Item>
        <Form.Item
          label={t('form.creation.format')}
          name="format"
          rules={[{ required: true, message: t('form.creation.format.validation') }]}
        >
          {/* // ! ResizeObserver loop limit exceeded https://github.com/ant-design/ant-design/issues/23246 */}
          <Select>
            {formats.map((value) => (
              <Select.Option key={value} value={value}>
                {value}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item label={t('form.creation.desc')} name="description">
          <Input.TextArea placeholder={t('form.creation.desc.placeholder')} />
        </Form.Item>
        <Row gutter={16}>
          <Col offset={4} span={10}>
            <Button type="primary" htmlType="submit" style={{ width: '100%' }}>
              {t('form.creation.button.sure')}
            </Button>
          </Col>
          <Col span={10}>
            <Button htmlType="button" onClick={props.onCancel} style={{ width: '100%' }}>
              {t('form.creation.button.cancel')}
            </Button>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
};

export default withModal<NamespaceCreateProps>(NamespaceCreate);
