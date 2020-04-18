import React from 'react';
import { Link } from 'react-router-dom';
import { Route as BreadcrumbItem } from 'antd/lib/breadcrumb/Breadcrumb';

export const renderBreadcrumbItem = (
  item: BreadcrumbItem,
  params: any,
  routes: Array<BreadcrumbItem>,
  paths: Array<string>,
): React.ReactNode => {
  return (
    <span key={item.breadcrumbName}>
      {/* // TODO Support external link */}
      <Link to={item.path}>{item.breadcrumbName}</Link>
    </span>
  );
};
