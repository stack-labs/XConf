import React, { FC } from 'react';
import { Col, Form, Input, Row, Tag } from 'antd';
import { renderNamespaceRelease } from '@src/renders';
import { Namespace } from '@src/typings';

export interface NamespaceInfoProps {
  namespace: Namespace;
}

const NamespaceInfo: FC<NamespaceInfoProps> = ({ namespace }) => {
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
      <Form.Item label="配置" labelCol={{ span: 2 }} wrapperCol={{ span: 22 }}>
        {/* // TODO Richer Editor */}
        <Input.TextArea
          rows={8}
          readOnly={namespace.released}
          value={namespace.released ? namespace.value : namespace.editValue}
        />
      </Form.Item>
    </Form>
  );
};

export default NamespaceInfo;
