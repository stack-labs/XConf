import React, { FC } from 'react';
import { Button, Col, Form, Input, Modal, Row, Select, message } from 'antd';
import { ModalProps } from 'antd/lib/modal';

import { withModal } from '@src/hoc';
import { createCluster } from '@src/services';
import { ClusterCreation, NamespaceFormat } from '@src/typings';

const halfFormLayout = { labelCol: { span: 8 }, wrapperCol: { span: 16 } };

export interface NamespaceCreateProps extends Omit<ModalProps, 'onOk' | 'onCancel'> {
  appName: string;
  clusterName: string;
  onOk?: () => void;
  onCancel?: () => void;
}

const NamespaceCreate: FC<NamespaceCreateProps> = ({ appName, clusterName, onOk, ...props }) => {
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
        onFinish={values =>
          createCluster(values as ClusterCreation)
            .then(() => {
              onOk && onOk();
              props.onCancel && props.onCancel();
            })
            .catch(err => message.error(`创建配置失败: ${err}`))
        }
      >
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item label="应用名" name="appName" {...halfFormLayout}>
              <Input readOnly />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="集群名" name="clusterName" {...halfFormLayout}>
              <Input readOnly />
            </Form.Item>
          </Col>
        </Row>
        <Form.Item
          label="配置名"
          name="namespaceName"
          rules={[{ required: true, message: '配置名不能为空' }, { validator: existNamespace }]}
        >
          <Input placeholder="请输入配置名" />
        </Form.Item>
        <Form.Item label="格式" name="format" rules={[{ required: true, message: '格式不能为空' }]}>
          <Select>
            {formats.map(value => (
              <Select.Option key={value} value={value}>
                {value}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item label="描述" name="description">
          <Input.TextArea placeholder="请输入配置的描述信息" />
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

export default withModal<NamespaceCreateProps>(NamespaceCreate);
