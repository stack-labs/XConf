import React, { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { Button, Col, Form, Input, Modal, Row, message } from 'antd';
import { ModalProps } from 'antd/lib/modal';

import { withModal } from '@src/hoc';
import { createApp } from '@src/services';
import { AppCreation } from '@src/typings';

export interface AppCreateProps extends Omit<ModalProps, 'onOk' | 'onCancel'> {
  onOk?: () => void;
  onCancel?: () => void;
}

const AppCreate: FC<AppCreateProps> = ({ onOk, ...props }) => {
  const { t } = useTranslation();

  const existApp = async (rule: any, value: string, callback: (error?: string) => void) => {
    // TODO Verify appName that exists
    return;
  };

  return (
    <Modal {...props} footer={null}>
      <Form
        labelCol={{ span: 4 }}
        wrapperCol={{ span: 20 }}
        onFinish={(values) =>
          createApp(values as AppCreation)
            .then(() => {
              onOk && onOk();
              props.onCancel && props.onCancel();
            })
            .catch((err) => message.error(t('form.creation.app.success') + `: ${err}`))
        }
      >
        <Form.Item
          label={t('form.creation.appName')}
          name="appName"
          rules={[{ required: true, message: t('form.creation.appName.validation') }, { validator: existApp }]}
        >
          <Input placeholder={t('form.creation.appName.placeholder')} />
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

export default withModal<AppCreateProps>(AppCreate);
