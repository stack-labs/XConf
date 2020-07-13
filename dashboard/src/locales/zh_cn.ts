import { Locale } from './interface';
import zhCN from 'antd/lib/locale/zh_CN';

const locale: Locale = {
  lng: 'zh_cn',
  langs: ['zh', 'zh_cn', 'zh_CN'],
  languageLabel: '简体中文',
  antLocale: zhCN,
  value: {
    'layout.title': '分布式配置中心',
    'layout.ownership': 'Micro China开源技术出品',

    'menus.applications': '应用列表',
    'menus.github': '项目地址',

    'table.filter': '关键字过滤',
    'table.filter_clear_button': '清除',

    'table.application.create': '创建新应用',
    'table.cluster.create': '创建新应用',
    'table.namespace.create': '创建新空间',

    'table.columns.cluster': '集群名',
    'table.columns.namespace': '空间名',
    'table.columns.description': '描述',
    'table.columns.status': '状态',
    'table.columns.createdAt': '创建时间',
    'table.columns.updatedAt': '更新时间',
    'table.columns.control': '操作',
    'table.columns.control.view': '查看',
    'table.columns.control.remove': '删除',
    'table.columns.control.history': '历史版本',
    'table.columns.control.import': '导入',
    'table.columns.control.export': '导出',

    'form.creation.applicationName': '应用名',
    'form.creation.clusterName': '集群名',
  },
};

export default locale;
