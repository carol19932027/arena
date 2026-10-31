/**
 * Mock Data — Users & RBAC
 * All data is client-side mock data. No backend or API calls.
 */

export const users = [
  {
    id: '1',
    firstName: 'علی',
    lastName: 'حسینی',
    username: 'ali.h',
    role: 'admin',
    status: 'active',
    email: 'ali@example.com',
    avatar: 'AH',
  },
  {
    id: '2',
    firstName: 'سarah',
    lastName: 'ج슨슨',
    username: 'sarah.j',
    role: 'editor',
    status: 'active',
    email: 'sarah@example.com',
    avatar: 'SJ',
  },
  {
    id: '3',
    firstName: 'مریم',
    lastName: 'احمدی',
    username: 'maryam.a',
    role: 'viewer',
    status: 'active',
    email: 'maryam@example.com',
    avatar: 'MA',
  },
  {
    id: '4',
    firstName: 'محمد',
    lastName: 'Rezaei',
    username: 'm.rezaei',
    role: 'editor',
    status: 'inactive',
    email: 'mohammad@example.com',
    avatar: 'MR',
  },
];

export const roles = [
  {
    id: 'admin',
    name: 'مدیر سیستم',
    nameEn: 'System Administrator',
    permissions: ['*'],
    description: 'دسترسی کامل به تمام بخش‌ها',
    descriptionEn: 'Full access to all sections',
    userCount: 1,
  },
  {
    id: 'editor',
    name: 'مُحرر',
    nameEn: 'Editor',
    permissions: ['blog:read', 'blog:write', 'blog:delete', 'users:read'],
    description: 'دسترسی به مدیریت مطالب و خواندن کاربران',
    descriptionEn: 'Access to manage posts and read users',
    userCount: 2,
  },
  {
    id: 'viewer',
    name: 'مشاهده‌گر',
    nameEn: 'Viewer',
    permissions: ['blog:read', 'users:read'],
    description: 'دسترسی فقط‌خواندنی',
    descriptionEn: 'Read-only access',
    userCount: 1,
  },
];
