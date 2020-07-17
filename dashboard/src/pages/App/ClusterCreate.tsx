import React, { FC } from 'react';
import { useTranslation } from 'react-i18next';
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
  const { t } = useTranslation();

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
            .catch((err) => message.error(t('form.creation.cluster.failure') + `: ${err}`))
        }
      >
        <Form.Item label={t('form.creation.appName')} name="appName">
          <Input readOnly />
        </Form.Item>
        <Form.Item
          label={t('form.creation.clusterName')}
          name="clusterName"
          rules={[{ required: true, message: t('form.creation.clusterName.validation') }, { validator: existCluster }]}
        >
          <Input placeholder={t('form.creation.clusterName.placeholder')} />
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

export default withModal<ClusterCreateProps>(ClusterCreate);
