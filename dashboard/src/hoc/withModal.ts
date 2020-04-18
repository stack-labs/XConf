import React from 'react';
import ReactDOM from 'react-dom';

import { ModalProps } from 'antd/lib/modal';

export const withModal = <P extends Omit<ModalProps, 'onOk' | 'onCancel'> & { onCancel?: () => void }>(
  WrappedComponent: React.ComponentType<P>,
) => {
  const WithModal = (props: P) => {
    const div = document.createElement('div');
    document.body.appendChild(div);

    const destroy = () => {
      const result = ReactDOM.unmountComponentAtNode(div);
      if (result && div.parentNode) div.parentNode.removeChild(div);
      props.onCancel && props.onCancel();
    };

    ReactDOM.render(
      React.createElement<P>(WrappedComponent, { ...props, onCancel: destroy, visible: true }),
      div,
    );
    return { destroy };
  };

  return WithModal;
};
