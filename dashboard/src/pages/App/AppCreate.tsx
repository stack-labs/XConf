import React, { FC } from 'react';
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
  const existApp = async (rule: any, value: string, callback: (error?: string) => void) => {
    // TODO Verify appName that exists
    return;
  };

  return (
    <Modal {...props} footer={null}>
      <Form
        labelCol={{ span: 4 }}
        wrapperCol={{ span: 20 }}
        onFinish={values =>
          createApp(values as AppCreation)
            .then(() => {
              onOk && onOk();
              props.onCancel && props.onCancel();
            })
            .catch(err => message.error(err))
        }
      >
        <Form.Item
          label="应用名"
          name="appName"
          rules={[{ required: true, message: '应用名不能为空' }, { validator: existApp }]}
        >
          <Input placeholder="请输入应用名" />
        </Form.Item>
        <Form.Item label="描述" name="description">
          <Input.TextArea placeholder="请输入应用的描述信息" />
        </Form.Item>
        <Row gutter={16}>
          <Col offset={4} span={10}>
            <Button type="primary" htmlType="submit" style={{ width: '100%' }}>
              创建
            </Button>
          </Col>
          <Col span={10}>
            <Button htmlType="button" onClick={props.onCancel} style={{ width: '100%' }}>
              取消
            </Button>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
};

export default withModal<AppCreateProps>(AppCreate);
