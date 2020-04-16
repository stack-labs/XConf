import React, { FC } from 'react';
import { Button, Col, Form, Input, Modal, Row, message } from 'antd';
import { ModalProps } from 'antd/lib/modal';

import { withModal } from '@src/hoc';
import { createCluster } from '@src/services';
import { ClusterCreation } from '@src/typings';

export interface ClusterCreateProps extends Omit<ModalProps, 'onOk' | 'onCancel'> {
  appName: string;
  onOk?: () => void;
  onCancel?: () => void;
}

const ClusterCreate: FC<ClusterCreateProps> = ({ appName, onOk, ...props }) => {
  const existCluster = async (rule: any, value: string, callback: (error?: string) => void) => {
    // TODO Verify appName that exists
    return;
  };

  return (
    <Modal {...props} footer={null}>
      <Form
        labelCol={{ span: 4 }}
        wrapperCol={{ span: 20 }}
        initialValues={{ appName }}
        onFinish={(values) =>
          createCluster(values as ClusterCreation)
            .then(() => {
              onOk && onOk();
              props.onCancel && props.onCancel();
            })
            .catch((err) => message.error(`创建集群失败: ${err}`))
        }
      >
        <Form.Item label="应用名" name="appName">
          <Input readOnly />
        </Form.Item>
        <Form.Item
          label="集群名"
          name="clusterName"
          rules={[{ required: true, message: '集群名不能为空' }, { validator: existCluster }]}
        >
          <Input placeholder="请输入集群名" />
        </Form.Item>
        <Form.Item label="描述" name="description">
          <Input.TextArea placeholder="请输入集群的描述信息" />
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

export default withModal<ClusterCreateProps>(ClusterCreate);
