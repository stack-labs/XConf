import { Locale } from './interface';
import zhCN from 'antd/lib/locale/zh_CN';

const locale: Locale = {
  lng: 'zh_cn',
  langs: ['zh', 'zh_cn', 'zh_CN'],
  languageLabel: '简体中文',
  antLocale: zhCN,
  value: {
    'layout.title': '分布式配置中心',
    'layout.subTit': '分布式配置中心',
    'layout.ownership': 'Micro China开源技术出品',

    'menus.apps': '应用列表',
    'menus.clusters': '集群列表',
    'menus.github': '项目地址',

    'empty.desc': '暂无描述',

    'card.app': '我的应用',
    'card.app.create': '创建新应用',
    'card.app.title': '应用',
    'card.cluster.create': '创建新集群',
    'card.cluster.title': '集群',
    'card.namespace.title': '命名空间配置',
    'card.namespace.create': '创建新配置',

    'table.filter': '关键字过滤',
    'table.filter_clear_button': '清除',
    'table.columns.app': '应用',
    'table.columns.cluster': '集群',
    'table.columns.namespace': '空间',
    'table.columns.comment': '说明',
    'table.columns.desc': '描述',
    'table.columns.status': '状态',
    'table.columns.createdAt': '创建时间',
    'table.columns.updatedAt': '更新时间',
    'table.columns.control': '操作',
    'table.columns.control.view': '查看',
    'table.columns.control.history': '历史版本',
    'table.columns.control.import': '导入',
    'table.columns.control.import.success': '配置导入成功',
    'table.columns.control.import.failure': '配置导入失败',
    'table.columns.control.export': '导出',
    'table.columns.control.rollback': '回滚',
    'table.columns.control.rollback.confirm': '确认回滚',
    'table.columns.control.rollback.success': '回滚成功',
    'table.columns.control.rollback.failure': '回滚失败',
    'table.columns.control.remove': '删除',
    'table.columns.control.remove.success': '删除成功',
    'table.columns.control.remove.failure': '删除失败',
    'table.columns.control.remove.confirm.app': '确认删除该应用?',
    'table.columns.control.remove.confirm.cluster': '确认删除该应用?',
    'table.columns.control.remove.confirm.namespace': '确认删除该空间?',

    'form.creation.appName': '应用名',
    'form.creation.appName.validation': '应用名不能为空',
    'form.creation.appName.placeholder': '请输入应用名',

    'form.creation.clusterName': '集群名',
    'form.creation.clusterName.validation': '集群名不能为空',
    'form.creation.clusterName.placeholder': '请输入集群名',

    'form.creation.namespace': '配置名',
    'form.creation.namespace.validation': '配置名不能为空',
    'form.creation.namespace.placeholder': '请输入配置名',

    'form.creation.format': '格式',
    'form.creation.format.validation': '格式不能为空',

    'form.creation.desc': '描述',
    'form.creation.desc.placeholder': '请输入描述内容',

    'form.creation.button.sure': '创建',
    'form.creation.button.cancel': '取消',
    'form.creation.app.success': '创建应用成功',
    'form.creation.app.failure': '创建应用失败',
    'form.creation.cluster.success': '创建集群成功',
    'form.creation.cluster.failure': '创建集群失败',
    'form.creation.namespace.success': '创建配置成功',
    'form.creation.namespace.failure': '创建配置失败',
  },
};

export default locale;
