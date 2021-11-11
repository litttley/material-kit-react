import { Icon } from '@iconify/react';
import pieChart2Fill from '@iconify/icons-eva/pie-chart-2-fill';
import peopleFill from '@iconify/icons-eva/people-fill';
import shoppingBagFill from '@iconify/icons-eva/shopping-bag-fill';
import fileTextFill from '@iconify/icons-eva/file-text-fill';
import toolFill from '@iconify/icons-ant-design/tool-fill';
import stockOutLine from '@iconify/icons-ant-design/stock-outline';
import transaction from '@iconify/icons-ant-design/transaction';
import lockFill from '@iconify/icons-eva/lock-fill';
import personAddFill from '@iconify/icons-eva/person-add-fill';
import alertTriangleFill from '@iconify/icons-eva/alert-triangle-fill';

// ----------------------------------------------------------------------

const getIcon = (name) => <Icon icon={name} width={22} height={22} />;

const sidebarConfig = [
  {
    title: '笔记',
    path: '/index/blog/list',
    icon: getIcon(fileTextFill)
  },
  {
    title: '工具',
    path: '',
    icon: getIcon(toolFill),
    children: [
      {
        title: '翻译',
        path: '/index/tools/translation',
        icon: getIcon(transaction)
      }
    ]
  },
  {
    title: '读书',
    path: '/index/reader',
    icon: getIcon(fileTextFill)
  },

  {
    title: '股票',
    path: '/index/stock',
    icon: getIcon(stockOutLine)
  },
  {
    title: 'dashboard',
    path: '/dashboard/app',
    icon: getIcon(pieChart2Fill)
  },
  {
    title: 'user',
    path: '/dashboard/user',
    icon: getIcon(peopleFill)
  },
  {
    title: 'product',
    path: '/dashboard/products',
    icon: getIcon(shoppingBagFill)
  },
  {
    title: 'blog1',
    path: '/dashboard/blog',
    icon: getIcon(fileTextFill)
  },
  {
    title: 'login',
    path: '/login',
    icon: getIcon(lockFill)
  },
  {
    title: 'register',
    path: '/register',
    icon: getIcon(personAddFill)
  },

  {
    title: 'Not found',
    path: '/404',
    icon: getIcon(alertTriangleFill)
  }
];

export default sidebarConfig;
