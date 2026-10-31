/**
 * Mock Data — Agents
 * All data is client-side mock data. No backend or API calls.
 */

export const agents = [
  {
    id: '1',
    name: 'مساعد اداری',
    nameEn: 'Admin Assistant',
    description: 'مدیریت کارهای اداری و برنامه‌ریزی',
    descriptionEn: 'Administrative tasks and scheduling',
    status: 'online',
    avatar: 'AA',
    color: '#007aff',
  },
  {
    id: '2',
    name: 'نویسنده خلاق',
    nameEn: 'Creative Writer',
    description: 'تولید محتوا و کاپیرایتن',
    descriptionEn: 'Content generation and copywriting',
    status: 'online',
    avatar: 'CW',
    color: '#34c759',
  },
  {
    id: '3',
    name: 'محلل داده',
    nameEn: 'Data Analyst',
    description: 'تحلیل داده‌ها و ارائه گزارش',
    descriptionEn: 'Data analysis and reporting',
    status: 'busy',
    avatar: 'DA',
    color: '#ffcc00',
  },
  {
    id: '4',
    name: 'مربی زبان',
    nameEn: 'Language Coach',
    description: 'آموزش زبان و گفتگو',
    descriptionEn: 'Language learning and conversation',
    status: 'offline',
    avatar: 'LC',
    color: '#8e8e93',
  },
];

export const messages = {
  '1': [
    { id: 'm1', sender: 'agent', text: 'سلام! چطور می‌توانم به شما کمک کنم؟', textEn: 'Hello! How can I help you today?', timestamp: '2026-10-31T09:00:00Z' },
    { id: 'm2', sender: 'user', text: 'من یک گزارش ماهانه نیاز دارم.', textEn: 'I need a monthly report.', timestamp: '2026-10-31T09:02:00Z' },
    { id: 'm3', sender: 'agent', text: 'بله، لطفاً نوع گزارش و بازه زمانی را مشخص کنید.', textEn: 'Sure, please specify the report type and date range.', timestamp: '2026-10-31T09:05:00Z' },
  ],
  '2': [],
  '3': [],
  '4': [],
};
