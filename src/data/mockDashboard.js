/**
 * Mock Data — Dashboard
 * All data is client-side mock data. No backend or API calls.
 */

export const stats = [
  {
    id: 'users',
    label: 'کاربران فعال',
    labelEn: 'Active Users',
    value: '1,234',
    change: '+12%',
    changeEn: '+12%',
    trend: 'positive',
    icon: '👥',
  },
  {
    id: 'posts',
    label: 'مطالب منتشر شده',
    labelEn: 'Published Posts',
    value: '89',
    change: '+5%',
    changeEn: '+5%',
    trend: 'positive',
    icon: '📝',
  },
  {
    id: 'files',
    label: 'فایل‌های ذخیره‌شده',
    labelEn: 'Stored Files',
    value: '4.2 GB',
    change: '-2%',
    changeEn: '-2%',
    trend: 'negative',
    icon: '📁',
  },
  {
    id: 'agents',
    label: 'آígenت‌های فعال',
    labelEn: 'Active Agents',
    value: '7',
    change: '0%',
    changeEn: '0%',
    trend: 'neutral',
    icon: '🤖',
  },
];

export const quickActions = [
  {
    id: 'new-post',
    label: 'مطلب جدید',
    labelEn: 'New Post',
    icon: '📝',
    path: '/blog',
  },
  {
    id: 'new-user',
    label: 'کاربر جدید',
    labelEn: 'New User',
    icon: '👤',
    path: '/users',
  },
  {
    id: 'new-folder',
    label: 'پوشه جدید',
    labelEn: 'New Folder',
    icon: '📁',
    path: '/files',
  },
  {
    id: 'new-agent',
    label: 'محادثه جدید',
    labelEn: 'New Conversation',
    icon: '💬',
    path: '/agents',
  },
];

export const activityLogs = [
  {
    id: '1',
    user: 'علی حسینی',
    action: 'مطلب جدید منتشر کرد',
    actionEn: 'published a new post',
    time: '۲ دقیقه قبل',
    timeEn: '2 minutes ago',
    type: 'post',
  },
  {
    id: '2',
    user: 'سarah ج.',
    action: 'پروفایل را ویرایش کرد',
    actionEn: 'updated profile',
    time: '۱۵ دقیقه قبل',
    timeEn: '15 minutes ago',
    type: 'user',
  },
  {
    id: '3',
    user: 'سیستم',
    action: 'باکت بک‌اپ متصل شد',
    actionEn: 'backup bucket connected',
    time: '۱ ساعت قبل',
    timeEn: '1 hour ago',
    type: 'system',
  },
  {
    id: '4',
    user: 'مریم احمدی',
    action: 'کاربر جدید اضافه شد',
    actionEn: 'added new user',
    time: '۳ ساعت قبل',
    timeEn: '3 hours ago',
    type: 'user',
  },
  {
    id: '5',
    user: 'سیستم',
    action: 'نسخه جدید انتشار یافت',
    actionEn: 'new version released',
    time: '۵ ساعت قبل',
    timeEn: '5 hours ago',
    type: 'system',
  },
];
