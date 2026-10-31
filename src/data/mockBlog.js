/**
 * Mock Data — Blog
 * All data is client-side mock data. No backend or API calls.
 */

export const categories = [
  { id: 'all', label: 'همه', labelEn: 'All' },
  { id: 'tech', label: 'تکنولوژی', labelEn: 'Technology' },
  { id: 'design', label: 'طراحی', labelEn: 'Design' },
  { id: 'business', label: 'व्यवसाय', labelEn: 'Business' },
  { id: 'lifestyle', label: 'سبک زندگی', labelEn: 'Lifestyle' },
];

export const posts = [
  {
    id: '1',
    title: 'معرفی iOS ۲۷ و Liquid Glass',
    titleEn: 'Introducing iOS 27 and Liquid Glass',
    content: `
      <p>Apple با ارائه iOS ۲۷، عصر جدیدی از طراحی رابط کاربری را آغاز کرد. Liquid Glass یا شیشه مائع، یک زبان طراحی جدید است با انباق نور واقعی و تجربه Netzтив-native که proximate می‌کند.</p>
      <p>ویژگی‌های اصلی:</p>
      <ul>
        <li>Refraction واقعی در Chromium و Safari</li>
        <li>تابلوهای شیشه‌ای با blur قابل تنظیم</li>
        <li>انیمیشن‌های استیل spring</li>
      </ul>
    `,
    author: 'علی حسینی',
    category: 'tech',
    status: 'published',
    createdAt: '2026-10-25T10:00:00Z',
    updatedAt: '2026-10-25T10:00:00Z',
  },
  {
    id: '2',
    title: 'ساخت PWA با سرویس ورکر مدرن',
    titleEn: 'Building Modern PWA with Service Worker',
    content: `
      <p>PWAها در سال ۲۰۲۶ از نظر امکانات بسیار پیشرفته‌تر شده‌اند. service workerها با استراتژی‌های cache-first و network-first، تجربه آفلاین بهتری ارائه می‌دهند.</p>
      <p>استراتژی‌ها:</p>
      <ol>
        <li>Cache-first برای app shell</li>
        <li>Network-first برای محتوای داینامیک</li>
        <li>Stale-while-revalidate برای تصاویر</li>
      </ol>
    `,
    author: 'سarah ج.',
    category: 'tech',
    status: 'published',
    createdAt: '2026-10-20T14:30:00Z',
    updatedAt: '2026-10-20T14:30:00Z',
  },
  {
    id: '3',
    title: ' RTL در وب اپلیکیشن‌های مدرن',
    titleEn: 'RTL in Modern Web Applications',
    content: `
      <p>پشتیبانی از راست‌چین (RTL) برای زبان‌های فارسی و عربی لزوماً در طراحی مدرن وب است. استفاده از ویژگی‌های منطقی CSS مانند margin-inline-start و padding-inline-end، کمک زیادی می‌کند.</p>
    `,
    author: 'مریم احمدی',
    category: 'design',
    status: 'draft',
    createdAt: '2026-10-18T09:15:00Z',
    updatedAt: '2026-10-18T09:15:00Z',
  },
  {
    id: '4',
    title: 'دستیار نویسندگی هوش مصنوعی',
    titleEn: 'AI Writing Assistant',
    content: `
      <p>ابزارهای writing assistant مبتنی بر LLM، توان تولید محتوای با کیفیت را بهופן قابل توجهی افزایش داده‌اند. این مقاله بررسی می‌کند چگونه می‌توان از این ابزارها در وب استفاده کرد.</p>
    `,
    author: 'علی حسینی',
    category: 'business',
    status: 'published',
    createdAt: '2026-10-15T11:00:00Z',
    updatedAt: '2026-10-15T11:00:00Z',
  },
];
